



# ChatHub - Tạo Tài Khoản Nhắn Tin Ngay 
<div align="center">
<img src="./frontend/public/chat-hub-logo-2.png" alt="ChatHub Logo" width="400" />
</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8+-green.svg)](https://www.mongodb.com/)
---

## ChatHub là gì?

Chào mừng bạn, đã đến với một sản phẩm nhỏ của mình.

- ChatHub là một phần mềm nhỏ giải quyết tình trạng thực tế ngày nay, nhiều bạn muốn networking nhưng lại hướng nội nên không có cơ hội.
- Ở ChatHub các bạn có làm quen với bất kì ai, miễn là họ đã tạo tài khoản và đang online, tất cả được liên kết với không khoảng cách và rào cản.
- Tin nhắn được lưu trữ một cách hệ thống không sợ mất khi đăng xuất, đặc biệt nhất việc tin nhắn chuyển tiếp là ngay lập tức ứng dụng Socket.io.
- Tính năng mở rộng dùng cloudinary để đăng tải ảnh đang trong quá trình cải thiện và sẽ release sớm.

## Về giao diện

Hệ thống chỉ gồm 4 layout chính lần lượt là
- Trang authentication nơi bạn có thể tạo tài khoản và đăng nhập
- Trang chủ hay nơi trò chuyện bạn sẽ tìm thấy các tài khoản đang online nhưng người đang cùng sử dụng và có nhu cầu trò chuyện ở đây
- Trang cài đặt là chỗ dành cho ai thích các theme màu độc lạ, hiện tại hệ thống hỗ trợ 32 theme màu nhờ sử dụng daisyui, tha hồ lựa chọn
- Trang cá nhân đây là chỗ để thể hiện màu sắc cá nhân bằng việc cập nhật profile và ảnh đại diện (đang trong quá trình thử nghiệm)


## Bắt đầu hành trình như thế nào?

Bạn muốn chạy thử ChatHub trên máy của mình? Đừng lo, nó đơn giản hơn bạn nghĩ. Hãy tưởng tượng chúng ta đang xây dựng một ngôi nhà, cần một chút móng (Backend) và nội thất (Frontend).

**Bước 1: Lấy bản thiết kế về**

Đầu tiên, bạn hãy clone dự án này về máy tính của mình. Mở terminal lên và gõ:

```bash
git clone [https://github.com/vanhuy2005/real-time-chat.git](https://github.com/vanhuy2005/real-time-chat.git)

cd real-time-chat
```

**Bước 2: Chuẩn bị nguyên vật liệu**

- Chúng ta cần cài đặt các gói thư viện cần thiết cho cả "nhà chính" và các "phòng ốc". Bạn chỉ cần chạy lệnh này ở thư mục gốc, nó sẽ tự động lo liệu cho cả Frontend và Backend:

```bash
npm run build
```

(Lưu ý: Hãy đảm bảo máy bạn đã cài Node.js v18 trở lên nhé)

**Bước 3: Cấu hình bí mật Mỗi ngôi nhà đều cần chìa khóa riêng.**

 - Hãy tạo file .env ở cả thư mục backend và frontend. 
 - Đừng lo, tôi đã để sẵn file mẫu .env.example ở đó, bạn chỉ cần điền thông tin của mình vào (như kết nối MongoDB hay Cloudinary) là xong.

**Bước 4: Giờ thì khởi động thôi nào**
- Hãy mở 2 cửa sổ terminal (hoặc tab):
- Tab 1 (Cho Backend): cd backend && npm run dev
- Tab 2 (Cho Frontend): cd frontend && npm run dev

Vậy là xong! Hãy truy cập vào http://localhost:5173 và bắt đầu cuộc trò chuyện đầu tiên.


## Techstack

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

## Cách Cài Đặt Repo

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

## Cấu trúc dự án 

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

## 🤝 Đóng góp

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

⭐ Nếu bạn cảm thấy repo này hay và thú vị, thể hiện tình cảm cách sao cho repo này!
