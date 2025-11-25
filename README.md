# 🚀ChatHub - A Real-Time Chat Platform
<div align="center">
![ChatHub Logo](frontend/public/chat-hub-logo.png)
</div>
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8+-green.svg)](https://www.mongodb.com/)

A modern, full-stack real-time chat application built with the MERN stack, featuring real-time messaging, user authentication, and a beautiful UI. Perfect for learning full-stack development or as a starting point for your own chat app.

## ✨ Features

-**Secure Authentication**: JWT-based login/signup with password hashing
-**Real-Time Messaging**: Instant messaging with Socket.io
-**Online Status**: See who's online in real-time
-**Modern UI**: Beautiful interface built with Tailwind CSS and DaisyUI
-**Responsive Design**: Works seamlessly on desktop and mobile
-**Image Upload**: Cloudinary integration for profile pictures
-**Theme Support**: Light/dark mode toggle
- **Error Handling**: Comprehensive error handling on both client and server
-**Production Ready**: Optimized for deployment

## 🛠️ Tech Stack

### Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Zustand** - State management
- **Axios** - HTTP client
- **Socket.io-client** - Real-time communication

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting and manipulation

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vanhuy2005/real-time-chat.git
   cd real-time-chat
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Create `.env` files in both `backend` and `frontend` directories:

   **Backend (.env)**

   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your_super_secret_jwt_key_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NODE_ENV=development
   ```

   **Frontend (.env)**

   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

4. **Start the application**

   **Development Mode:**

   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev

   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

   **Production Mode:**

   ```bash
   # Build frontend
   cd frontend
   npm run build

   # Start backend (serves frontend statically)
   cd backend
   npm start
   ```

5. **Access the app**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5001](http://localhost:5001)

## 📁 Project Structure

```bash
fullstack-chat-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── lib/
│   ├── public/
│   ├── package.json
│   └── .env
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Văn Huy** - [GitHub](https://github.com/vanhuy2005)

Project Link: [https://github.com/vanhuy2005/real-time-chat](https://github.com/vanhuy2005/real-time-chat)

---

⭐ If you found this project helpful, please give it a star!
