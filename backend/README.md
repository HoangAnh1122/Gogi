# 🚀 Backend API - Hệ Thống Quản Lý Ảnh Thông Minh

Backend API cho hệ thống quản lý ảnh thông minh, được xây dựng với Node.js, Express, TypeScript và MongoDB. Cung cấp các API endpoints cho xác thực người dùng, quản lý ảnh, tích hợp Google Drive, và chức năng chatbot AI.

## 📋 Tổng Quan

- **Framework**: Node.js + Express + TypeScript
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT (JSON Web Token)
- **AI Integration**: DeepFace cho nhận diện khuôn mặt, Google Gemini AI
- **Storage**: Google Drive API
- **Workflow Engine**: n8n Integration
- **Chatbot Platform**: Zalo Official Account & Facebook Messenger

## 🏗️ Cấu Trúc Dự Án

```
backend/
├── src/
│   ├── config/           # Cấu hình ứng dụng
│   │   ├── config.ts     # Cấu hình chính
│   │   └── database.ts   # Kết nối MongoDB
│   ├── controllers/      # Logic xử lý API
│   │   ├── authController.ts      # Xác thực & phân quyền
│   │   ├── imageController.ts     # Quản lý ảnh
│   │   ├── driveController.ts     # Google Drive API
│   │   ├── chatbotController.ts   # Chatbot logic
│   │   ├── workflowController.ts  # n8n Workflow API
│   │   └── systemController.ts    # Cấu hình hệ thống
│   ├── models/           # MongoDB Schemas
│   │   ├── User.ts       # Schema người dùng
│   │   ├── Image.ts      # Schema ảnh
│   │   └── DriveConfig.ts # Schema cấu hình Drive
│   ├── routes/           # API Routes
│   │   ├── authRoutes.ts
│   │   ├── imageRoutes.ts
│   │   ├── driveRoutes.ts
│   │   ├── chatbotRoutes.ts
│   │   ├── workflowRoutes.ts
│   │   └── systemRoutes.ts
│   ├── services/         # Business Logic Services
│   │   ├── n8nService.ts        # n8n Workflow Service
│   │   ├── deepFaceService.ts   # AI Face Recognition
│   │   └── googleDriveService.ts # Google Drive Service
│   ├── middleware/       # Express Middleware
│   │   ├── authMiddleware.ts    # JWT Authentication
│   │   └── errorHandler.ts     # Error Handling
│   ├── scripts/          # Utility Scripts
│   │   └── python/       # Python scripts cho DeepFace
│   └── index.ts          # Entry point
├── uploads/              # Thư mục lưu trữ ảnh
├── temp/                 # Thư mục tạm
├── .venv/                # Python Virtual Environment
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md            # Tài liệu này
```

## ⚙️ Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống
- Node.js >= 16.x
- MongoDB >= 4.x (local hoặc Atlas)
- Python >= 3.8 (cho DeepFace AI)
- Git

### 1. Cài Đặt Dependencies

```bash
# Cài đặt Node.js dependencies
npm install

# Tạo Python virtual environment cho DeepFace
python -m venv .venv

# Kích hoạt virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Cài đặt Python dependencies
pip install -r scripts/python/requirements.txt
```

### 2. Cấu Hình Environment Variables

Tạo file `.env` trong thư mục backend:

```env
# Server Configuration
PORT=5000
FRONTEND_BASE_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/smart-photo-management

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# n8n Workflow Engine
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key_here

# Google Drive API
GOOGLE_DRIVE_CLIENT_ID=your_google_drive_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_google_drive_client_secret

# Google Gemini AI
GOOGLE_GENAI_API_KEY=your_gemini_api_key
GEMINI_MODEL_ID=gemini-1.5-pro

# DeepFace Configuration
DEEPFACE_MODEL=VGG-Face
DEEPFACE_DETECTOR=opencv
DEEPFACE_METRIC=cosine
DEEPFACE_QUALITY_THRESHOLD=80
DEEPFACE_SIMILARITY_THRESHOLD=0.6

# File Upload
UPLOAD_DIR=uploads
```

### 3. Cấu Hình Google Drive API

1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới hoặc chọn project hiện có
3. Kích hoạt Google Drive API
4. Tạo OAuth 2.0 Client ID (Web application)
5. Thêm redirect URI: `http://localhost:5000/api/drive/oauth2callback`
6. Copy Client ID và Client Secret vào file `.env`

### 4. Khởi Động Server

```bash
# Development mode với auto-reload
npm run dev

# Production mode
npm run build
npm start
```

Server sẽ chạy tại: **http://localhost:5000**

## 🔧 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Đăng ký tài khoản mới
- `POST /login` - Đăng nhập
- `POST /logout` - Đăng xuất
- `GET /profile` - Lấy thông tin profile
- `PUT /profile` - Cập nhật profile

### Image Management (`/api/images`)
- `POST /upload` - Upload ảnh
- `GET /` - Lấy danh sách ảnh
- `GET /:id` - Lấy thông tin ảnh theo ID
- `DELETE /:id` - Xóa ảnh
- `POST /process` - Xử lý ảnh với AI

### Google Drive (`/api/drive`)
- `GET /auth` - Khởi tạo OAuth flow
- `GET /oauth2callback` - Callback sau khi authorize
- `GET /folders` - Lấy danh sách folders
- `GET /files/:folderId` - Lấy files trong folder
- `POST /scan` - Quét folder và xử lý ảnh

### Chatbot (`/api/chatbot`)
- `POST /webhook/zalo` - Webhook cho Zalo OA
- `POST /webhook/facebook` - Webhook cho Facebook Messenger
- `POST /process-message` - Xử lý tin nhắn chatbot

### Workflows (`/api/workflows`)
- `GET /` - Lấy danh sách workflows
- `POST /:id/execute` - Thực thi workflow
- `GET /:id/status` - Kiểm tra trạng thái workflow

### System (`/api/system`)
- `GET /config` - Lấy cấu hình hệ thống
- `PUT /config` - Cập nhật cấu hình
- `GET /health` - Health check

## 👥 Tài Khoản Mặc Định

Khi khởi động lần đầu, hệ thống tự động tạo:

- **Admin**: `admin@example.com` / `admin123`
  - Quyền: Quản trị toàn hệ thống
- **User**: `user@example.com` / `user123`
  - Quyền: Sử dụng chatbot và xem ảnh

## 🤖 Tích Hợp AI & Automation

### DeepFace AI
- **Chức năng**: Nhận diện và phân tích khuôn mặt
- **Models**: VGG-Face, FaceNet, OpenFace, DeepFace
- **Detectors**: OpenCV, MTCNN, RetinaFace

### Google Gemini AI
- **Chức năng**: Xử lý ngôn ngữ tự nhiên cho chatbot
- **Model**: gemini-1.5-pro
- **Features**: Hiểu context, trả lời thông minh

### n8n Workflows
- **Google Drive Scanner**: Tự động quét ảnh mới
- **Face Recognition**: Phân tích khuôn mặt batch
- **Image Selection**: Chọn ảnh đẹp nhất
- **Chatbot Response**: Tự động phản hồi người dùng

## 📊 Database Schema

### User Collection
```typescript
{
  email: string;
  password: string; // Hashed
  fullName: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}
```

### Image Collection
```typescript
{
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: ObjectId; // User reference
  faces: Array<{
    confidence: number;
    coordinates: object;
    emotion: string;
  }>;
  metadata: object;
  createdAt: Date;
}
```

### DriveConfig Collection
```typescript
{
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔍 Troubleshooting

### Lỗi Phổ Biến

**1. MongoDB Connection Error**
```bash
# Kiểm tra MongoDB đang chạy
mongod --version
# Hoặc với Docker
docker ps | grep mongo
```

**2. Python/DeepFace Error**
```bash
# Kích hoạt virtual environment
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Cài đặt lại dependencies
pip install -r scripts/python/requirements.txt
```

**3. Google Drive API Error**
- Kiểm tra credentials trong `.env`
- Đảm bảo redirect URI đúng trong Google Cloud Console
- Xem logs để kiểm tra OAuth flow

**4. n8n Connection Error**
- Đảm bảo n8n đang chạy tại port 5678
- Kiểm tra N8N_API_KEY trong `.env`

### Logs & Debugging
```bash
# Xem logs chi tiết
DEBUG=* npm run dev

# Chỉ logs của app
DEBUG=app:* npm run dev
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
# Build image
docker build -t smart-photo-backend .

# Run container
docker run -p 5000:5000 --env-file .env smart-photo-backend
```

### Environment Variables cho Production
- Sử dụng MongoDB Atlas thay vì local MongoDB
- Cấu hình CORS cho domain production
- Sử dụng SSL/HTTPS
- Cấu hình rate limiting
- Setup monitoring và logging

---

**Lần cập nhật cuối**: $(date)
**Version**: 1.0.0
**Maintainer**: Smart Photo Management Team 