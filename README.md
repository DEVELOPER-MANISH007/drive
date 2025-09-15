# Drive App

Express + EJS app with authentication and Cloudinary-backed uploads.

## Setup

1. Install dependencies:

```
npm install
```

2. Create `.env` in project root based on the example below:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=change_this_secret
MONGODB_URI=your_connection
```

3. Run locally:

```
npm run dev
```

## Scripts
- `npm start` – start server
- `npm run dev` – start with nodemon

## Features
- Register/Login with JWT (cookie)
- Protected home at `/home`
- Upload to Cloudinary, list, download, delete
- Tailwind-styled UI
