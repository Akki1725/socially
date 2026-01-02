# Instagram Clone

A simplified Instagram-like full-stack web application.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/instagram-clone
JWT_SECRET=your-secret-key-change-this
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

3. Make sure MongoDB is running locally, or update `MONGODB_URI` to your MongoDB connection string.

4. Set up Cloudinary:

   - Create a Cloudinary account at https://cloudinary.com
   - Create an unsigned upload preset
   - Add your cloud name and upload preset to `.env`

5. Run the application:

```bash
npm run dev
```

This will start both the Express server (port 5000) and Vite frontend (port 3000).

## Features

- User authentication (Sign Up, Sign In)
- User profiles with profile pictures
- Create posts with images and captions
- Feed page showing all posts
- View user profiles and their posts
# socially
