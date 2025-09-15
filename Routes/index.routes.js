const express = require("express");
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types
    cb(null, true);
  }
});

// Store uploaded files info (in production, use database)
let uploadedFiles = [];

// Root route - redirect based on authentication
router.get("/", (req, res) => {
    const token = req.cookies.token;
    if (token) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

router.get("/home", authenticateToken, (req, res) => {
    res.render("home", { files: uploadedFiles, user: req.user });
});

// Upload file route
router.post("/upload-file", authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: 'drive-files'
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ error: 'Upload failed' });
                }
                
                // Store file info
                const fileInfo = {
                    id: result.public_id,
                    name: req.file.originalname,
                    url: result.secure_url,
                    size: result.bytes,
                    format: result.format,
                    uploadedAt: new Date()
                };
                
                uploadedFiles.push(fileInfo);
                
                res.json({ 
                    success: true, 
                    message: 'File uploaded successfully',
                    file: fileInfo
                });
            }
        ).end(req.file.buffer);

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Download file route
router.get("/download/:fileId", authenticateToken, async (req, res) => {
    try {
        const fileId = decodeURIComponent(req.params.fileId);
        const file = uploadedFiles.find(f => f.id === fileId);
        
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Generate download URL from Cloudinary
        const downloadUrl = cloudinary.url(fileId, {
            flags: 'attachment',
            resource_type: 'auto'
        });

        res.redirect(downloadUrl);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Download failed' });
    }
});

// Get all files
router.get("/files", authenticateToken, (req, res) => {
    res.json({ files: uploadedFiles });
});

// Test delete route (for debugging)
router.get("/test-delete/:fileId", authenticateToken, (req, res) => {
    const fileId = req.params.fileId;
    const fileIndex = uploadedFiles.findIndex(f => f.id === fileId);
    
    res.json({ 
        fileId, 
        fileIndex, 
        files: uploadedFiles.map(f => ({ id: f.id, name: f.name }))
    });
});

// Delete file route
router.delete("/delete/:fileId", authenticateToken, async (req, res) => {
    try {
        console.log('Delete request received for fileId:', req.params.fileId);
        const fileId = decodeURIComponent(req.params.fileId);
        const fileIndex = uploadedFiles.findIndex(f => f.id === fileId);
        
        console.log('File index found:', fileIndex);
        console.log('Current files:', uploadedFiles.map(f => f.id));
        
        if (fileIndex === -1) {
            console.log('File not found in array');
            return res.status(404).json({ error: 'File not found' });
        }

        const fileToDelete = uploadedFiles[fileIndex];
        console.log('Deleting file:', fileToDelete);

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(fileId);
            console.log('File deleted from Cloudinary');
        } catch (cloudinaryError) {
            console.error('Cloudinary delete error:', cloudinaryError);
            // Continue with local deletion even if Cloudinary fails
        }
        
        // Remove from local array
        uploadedFiles.splice(fileIndex, 1);
        console.log('File removed from local array');
        
        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Delete failed: ' + error.message });
    }
});

module.exports = router;