# Socially

A modern social media web application inspired by Instagram, built entirely using AI-powered development tools in Cursor IDE.

## About

Socially is a full-stack social media platform that enables users to share photos, connect with others, and communicate in real-time. This project was developed as part of an AI internship assignment (uGSOT), demonstrating the capabilities of AI-assisted development using Cursor IDE.

**Note:** This application was created using AI prompts and code generation within Cursor IDE, showcasing the power of AI-driven development workflows rather than traditional manual coding.

## Features

- **User Authentication** - Secure sign-up and sign-in with JWT-based authentication
- **Feed** - Browse posts from all users in a clean, Instagram-inspired layout
- **Create Posts** - Upload images with captions using Cloudinary integration
- **Like System** - Like/unlike posts with real-time updates via Socket.IO
- **User Profiles** - View user profiles with their posts and customizable profile pictures
- **Messaging System** - Real-time chat between users with message persistence
- **Find People** - Discover and connect with other users
- **Real-time Updates** - Live notifications and message updates using Socket.IO
- **Responsive Design** - Mobile-friendly UI built with Tailwind CSS

## Tech Stack

### Frontend

- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication tokens

### Services

- **Cloudinary** - Image upload and hosting
- **Vite** - Build tool and dev server

```
instagram-clone/
├── server/
│   ├── index.js          # Express server setup
│   ├── models/          # MongoDB models (User, Post, Chat)
│   ├── routes/          # API routes (auth, users, posts, chats)
│   └── middleware/      # Authentication middleware
├── src/
│   ├── pages/           # React page components
│   ├── components/      # Reusable components (Navbar)
│   ├── utils/           # Utilities (API, socket, cloudinary)
│   └── App.jsx          # Main app component
└── README.md
```

## Assignment Context

This project was developed as part of the **uGSOT AI Internship** assignment, focusing on:

- Demonstrating AI-assisted development capabilities
- Building a complete full-stack application using AI tools
- Showcasing modern web development practices
- Implementing real-time features and responsive design

## License

See [LICENSE.md](LICENSE.md) for license information.

## Author

**Akshit Kumar**

---

Built with ❤️ using AI-powered development in Cursor IDE
