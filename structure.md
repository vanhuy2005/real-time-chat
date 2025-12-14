# 📁 Cấu Trúc Hệ Thống - ChatHub Real-Time Chat

## 🏗️ Tổng Quan Kiến Trúc

ChatHub là một ứng dụng chat real-time được xây dựng theo kiến trúc **MERN Stack** (MongoDB, Express.js, React, Node.js) với Socket.io để xử lý real-time communication.

```
real-time-chat/
├── 📂 backend/           # Server-side (Node.js + Express)
├── 📂 frontend/          # Client-side (React + Vite)
├── 📄 package.json       # Root package configuration
├── 📄 README.md          # Tài liệu dự án
├── 📄 LICENSE            # Giấy phép MIT
└── 📄 .gitignore         # Git ignore rules
```

---

## 🔧 Backend Structure (Node.js + Express)

```
backend/
├── 📂 src/
│   ├── 📂 controllers/           # Business Logic Layer
│   │   ├── 📄 auth.controller.js     # Xử lý authentication (login, signup, logout)
│   │   └── 📄 message.controller.js  # Xử lý tin nhắn (send, get messages, get users)
│   │
│   ├── 📂 lib/                   # Utility Libraries
│   │   ├── 📄 cloudinary.js          # Cấu hình Cloudinary cho upload ảnh
│   │   ├── 📄 db.js                  # Kết nối MongoDB database
│   │   ├── 📄 socket.js              # Socket.io server setup
│   │   └── 📄 utils.js               # Utility functions
│   │
│   ├── 📂 middleware/            # Middleware Layer
│   │   └── 📄 auth.middleware.js     # JWT authentication middleware
│   │
│   ├── 📂 models/                # Data Models (Mongoose)
│   │   ├── 📄 message.model.js       # Schema cho tin nhắn
│   │   └── 📄 user.model.js          # Schema cho người dùng
│   │
│   ├── 📂 routes/                # API Routes
│   │   ├── 📄 auth.route.js          # Routes cho authentication
│   │   └── 📄 message.route.js       # Routes cho tin nhắn
│   │
│   ├── 📂 seeds/                 # Database Seeding
│   │   └── 📄 user.seed.js           # Tạo dữ liệu mẫu cho users
│   │
│   └── 📄 index.js               # Entry point của server
│
├── 📄 package.json               # Dependencies và scripts
└── 📄 package-lock.json          # Lock file cho dependencies
```

### 🔑 Backend Key Features:
- **Authentication**: JWT-based với bcryptjs hashing
- **Real-time**: Socket.io cho messaging real-time
- **Database**: MongoDB với Mongoose ODM
- **File Upload**: Cloudinary integration
- **Security**: CORS, cookie-parser, middleware protection

---

## 🎨 Frontend Structure (React + Vite)

```
frontend/
├── 📂 public/                    # Static Assets
│   ├── 📄 avatar.png                 # Default avatar image
│   ├── 📄 chat-hub-logo-2.png        # Logo của ứng dụng
│   └── 📄 vite.svg                   # Vite icon
│
├── 📂 src/
│   ├── 📂 components/            # Reusable Components
│   │   ├── 📂 skeletons/             # Loading Skeletons
│   │   │   ├── 📄 MessageSkeleton.jsx    # Skeleton cho tin nhắn
│   │   │   └── 📄 SidebarSkeleton.jsx    # Skeleton cho sidebar
│   │   │
│   │   ├── 📄 AuthImagePattern.jsx   # Pattern cho trang auth
│   │   ├── 📄 ChatContainer.jsx      # Container chính cho chat
│   │   ├── 📄 ChatHeader.jsx         # Header của chat window
│   │   ├── 📄 MessageInput.jsx       # Input để gửi tin nhắn
│   │   ├── 📄 Navbar.jsx             # Navigation bar
│   │   ├── 📄 NoChatSelected.jsx     # UI khi chưa chọn chat
│   │   └── 📄 Sidebar.jsx            # Sidebar danh sách users
│   │
│   ├── 📂 constants/             # Application Constants
│   │   └── 📄 index.js               # Các hằng số của app
│   │
│   ├── 📂 lib/                   # Utility Libraries
│   │   ├── 📄 axios.js               # Axios configuration
│   │   └── 📄 utils.js               # Utility functions
│   │
│   ├── 📂 pages/                 # Page Components
│   │   ├── 📄 HomePage.jsx           # Trang chủ (chat interface)
│   │   ├── 📄 LoginPage.jsx          # Trang đăng nhập
│   │   ├── 📄 ProfilePage.jsx        # Trang profile người dùng
│   │   ├── 📄 SettingsPage.jsx       # Trang cài đặt (theme)
│   │   └── 📄 SignUpPage.jsx         # Trang đăng ký
│   │
│   ├── 📂 store/                 # State Management (Zustand)
│   │   ├── 📄 useAuthStore.js        # Store cho authentication
│   │   ├── 📄 useChatStore.js        # Store cho chat functionality
│   │   └── 📄 useThemeStore.js       # Store cho theme management
│   │
│   ├── 📄 App.jsx                # Root component
│   ├── 📄 index.css              # Global styles
│   └── 📄 main.jsx               # Entry point
│
├── 📄 eslint.config.js           # ESLint configuration
├── 📄 index.html                 # HTML template
├── 📄 package.json               # Dependencies và scripts
├── 📄 postcss.config.js          # PostCSS configuration
├── 📄 tailwind.config.js         # Tailwind CSS configuration
└── 📄 vite.config.js             # Vite build configuration
```

### 🎯 Frontend Key Features:
- **UI Framework**: React 18 với Vite build tool
- **Styling**: Tailwind CSS + DaisyUI components
- **State Management**: Zustand cho global state
- **Routing**: React Router DOM
- **Real-time**: Socket.io-client
- **HTTP Client**: Axios với interceptors
- **Notifications**: React Hot Toast

---

## 🔄 Data Flow Architecture

```
┌─────────────────┐    HTTP/Socket.io    ┌─────────────────┐
│                 │ ◄─────────────────► │                 │
│   React Client  │                     │  Express Server │
│   (Frontend)    │                     │   (Backend)     │
│                 │                     │                 │
└─────────────────┘                     └─────────────────┘
         │                                       │
         │ Zustand State                         │ Mongoose ODM
         │ Management                            │
         ▼                                       ▼
┌─────────────────┐                     ┌─────────────────┐
│   Local State   │                     │   MongoDB       │
│   - Auth Store  │                     │   Database      │
│   - Chat Store  │                     │   - Users       │
│   - Theme Store │                     │   - Messages    │
└─────────────────┘                     └─────────────────┘
```

---

## 🚀 Deployment Structure

### Development Mode:
- **Frontend**: `http://localhost:5173` (Vite dev server)
- **Backend**: `http://localhost:5001` (Express server)

### Production Mode:
- **Backend** serves static frontend files từ `frontend/dist`
- Single server deployment trên port 5001

---

## 📦 Dependencies Overview

### Backend Dependencies:
- **Core**: `express`, `mongoose`, `socket.io`
- **Auth**: `jsonwebtoken`, `bcryptjs`, `cookie-parser`
- **Utils**: `cors`, `dotenv`, `cloudinary`
- **Dev**: `nodemon`

### Frontend Dependencies:
- **Core**: `react`, `react-dom`, `vite`
- **Routing**: `react-router-dom`
- **State**: `zustand`
- **HTTP**: `axios`, `socket.io-client`
- **UI**: `tailwindcss`, `daisyui`, `lucide-react`
- **Utils**: `react-hot-toast`

---

## 🔐 Security Features

1. **JWT Authentication** với HTTP-only cookies
2. **Password Hashing** với bcryptjs
3. **CORS Protection** cho cross-origin requests
4. **Input Validation** ở cả client và server
5. **Environment Variables** cho sensitive data
6. **Middleware Protection** cho protected routes

---

## 📱 Responsive Design

- **Mobile-first** approach với Tailwind CSS
- **DaisyUI components** cho consistent UI
- **Theme support** (light/dark mode)
- **Skeleton loading** cho better UX

---

*Cấu trúc này được thiết kế để dễ dàng mở rộng, bảo trì và deploy. Mỗi module có trách nhiệm rõ ràng và tách biệt, tuân theo các nguyên tắc clean architecture.*