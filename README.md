# ChatHub - Tạo Tài Khoản Nhắn Tin Ngay 
<div align="center">
<img src="./frontend/public/chat-hub-logo-2.png" alt="ChatHub Logo" width="400" />
</div>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white" alt="Express.js"></a>
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" alt="React"></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB"></a>
  <a href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.io-010101?logo=socketdotio&logoColor=white" alt="Socket.io"></a>
  <a href="https://redis.io/"><img src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white" alt="Redis"></a>
  <a href="https://webrtc.org/"><img src="https://img.shields.io/badge/WebRTC-333333?logo=webrtc&logoColor=white" alt="WebRTC"></a>
</p>
<p align="center">
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black" alt="Firebase"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://daisyui.com/"><img src="https://img.shields.io/badge/DaisyUI-5A0EF8?logo=css3&logoColor=white" alt="DaisyUI"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://zustand-demo.pmnd.rs/"><img src="https://img.shields.io/badge/Zustand-Bear-orange" alt="Zustand"></a>
</p>
---

## 📑 Mục lục nhanh (Quick Links)
- 🏗️ [Toàn bộ thông tin về hệ thống](./docs/structure/structure.md)
- 🎨 [Brand Guidelines của dự án](./docs/brand-guidelines/UI-UX-guidelines.md)
- 📞 [Các feature đang và có thể đã dev hoàn thiện](./docs/features/)
-    [Cách đảm bảo chất lượng code](./docs/test/)
- 💻 [Mã nguồn Frontend](./frontend/src/)
- ⚙️ [Mã nguồn Backend](./backend/src/)

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
- **WebRTC** - Peer-to-peer (P2P) Audio/Video Streaming
- **Vitest & React Testing Library** - Component & Store Unit Testing

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Jest & Supertest** - API Integration Testing & Mocking
- **MongoDB Memory Server** - In-memory Database for Testing
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time bidirectional communication
- **@socket.io/redis-adapter** - Multi-instance clustering
- **Upstash Redis** - Caching, Pub/Sub, Rate-limiting
- **node-cron** - Background garbage collection & ping keep-alive
- **Firebase Admin SDK** - Web push notifications
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
   REDIS_URL=redis://localhost:6379
   METERED_API_KEY=your_metered_turn_server_api_key
   METERED_DOMAIN=chathub.metered.live
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
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
