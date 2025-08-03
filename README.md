# 🤖 Hệ Thống Quản Lý Ảnh Thông Minh (Smart Photo Management System)

## 📋 Tổng Quan Dự Án

Hệ thống quản lý ảnh thông minh tích hợp AI nhận diện khuôn mặt, chatbot, và Google Drive để tự động phân tích, chọn lọc và tổ chức ảnh.

### 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vue.js FE     │◄──►│   Backend API   │◄──►│  n8n Workflows  │
│                 │    │                 │    │                 │
│ • Admin Panel   │    │ • Auth API      │    │ • Core Workflows│
│ • User Dashboard│    │ • Image API     │    │ • AI Processing │
│ • Image Gallery │    │ • Drive API     │    │ • Chatbot Logic │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                      ▲
                                                      │
                                                      ▼
                                            ┌─────────────────┐
                                            │  External APIs  │
                                            │                 │
                                            │ • Google Drive  │
                                            │ • DeepFace API  │
                                            │ • Zalo/FB Bot   │
                                            └─────────────────┘
```

### 👥 Tác Nhân (Actors)

1. **Admin**: Quản trị hệ thống, cấu hình workflows, xem báo cáo
2. **User**: Sử dụng chatbot, xem kết quả xử lý ảnh
3. **AI System**: Tự động phân tích, xử lý ảnh thông qua DeepFace

### 🔄 Workflow Chính

1. **Quét ảnh từ Google Drive** → 2. **Phân tích khuôn mặt (DeepFace)** → 3. **Chọn ảnh đẹp nhất** → 4. **Tạo folder mới & sao chép** → 5. **Thông báo qua chatbot**

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: Vue.js 3 + Composition API + TypeScript
- **Backend API**: Node.js + Express + TypeScript + MongoDB
- **Workflow Engine**: n8n Workflow Automation
- **AI**: DeepFace cho nhận diện khuôn mặt
- **Storage**: Google Drive API
- **Chatbot**: Zalo Official Account, Facebook Messenger
- **UI Framework**: Element Plus / Quasar

## 📂 Cấu Trúc Project

```
Gogi/
├── frontend/              # Vue.js Frontend
├── backend/               # Node.js Express API
│   ├── src/               # TypeScript source code
│   │   ├── controllers/   # API controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Middleware functions
│   │   ├── services/      # Services
│   │   └── config/        # Configuration
├── n8n-workflows/         # n8n Workflow Files
│   ├── core-workflows/    # Main system workflows
│   ├── ai-integration/    # AI specific workflows
│   ├── chatbot-integration/ # Chatbot integration workflows
│   └── security/          # Security related workflows
├── docs/                  # Documentation
├── scripts/               # Setup & Utility Scripts
└── .venv/                 # Python Virtual Environment
```

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống
- Node.js (v14+)
- MongoDB (local hoặc Atlas)
- Python 3.8+ (cho n8n)

### 1. Cài Đặt MongoDB
- Tải và cài đặt MongoDB từ [trang chính thức](https://www.mongodb.com/try/download/community)
- Hoặc sử dụng MongoDB Atlas (cloud)
- Tạo database có tên `smart-photo-management`

### 2. Cài Đặt & Chạy Backend API
```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env với nội dung sau
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-photo-management
JWT_SECRET=your_jwt_secret_key_here
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key_here
GOOGLE_DRIVE_CLIENT_ID=your_google_client_id_here
GOOGLE_DRIVE_CLIENT_SECRET=your_google_client_secret_here
UPLOAD_DIR=./uploads" > .env

# Chạy development server
npm run dev
```

Backend API sẽ chạy tại: **http://localhost:5000**

### 3. Cài Đặt & Chạy Frontend
```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env với nội dung sau
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3000**

### 4. Cài Đặt & Chạy n8n Workflow Engine

#### Windows
```bash
# Cài đặt n8n globally
npm install -g n8n

# Chạy n8n
n8n start
```

#### macOS/Linux
```bash
# Cài đặt n8n globally
npm install -g n8n

# Chạy n8n
n8n start
```

n8n Workflow Engine sẽ chạy tại: **http://localhost:5678**

### 5. Cài Đặt Python Environment cho DeepFace

#### Windows
```bash
# Tạo và kích hoạt môi trường ảo Python
python -m venv .venv
.venv\Scripts\activate

# Cài đặt dependencies Python
cd backend
pip install -r scripts/python/requirements.txt
```

#### macOS/Linux
```bash
# Tạo và kích hoạt môi trường ảo Python
python -m venv .venv
source .venv/bin/activate

# Cài đặt dependencies Python
cd backend
pip install -r scripts/python/requirements.txt
```

**Lưu ý**: Nếu gặp lỗi với DeepFace, hãy thử cài đặt phiên bản minimal:
```bash
pip install -r scripts/python/requirements-minimal.txt
```

### 6. Cấu Hình n8n Workflows
1. Truy cập n8n tại http://localhost:5678
2. Đăng nhập với tài khoản mặc định (email: admin@example.com, password: password)
3. Import các workflow từ thư mục `n8n-workflows`:
   - Vào **Workflows** > **Import from file**
   - Chọn các file JSON trong thư mục `n8n-workflows/core-workflows`
   - Lặp lại cho các thư mục workflow khác
4. Kích hoạt các workflow cần thiết

### 7. Truy Cập Hệ Thống
- **Frontend**: http://localhost:3000
  - **Admin**: `admin@example.com` / `admin123`
  - **User**: `user@example.com` / `user123`
- **Backend API**: http://localhost:5000
- **n8n Workflow Engine**: http://localhost:5678

## 🔧 Cấu Hình Nâng Cao

### Google Drive API
1. Tạo project trên [Google Cloud Console](https://console.cloud.google.com/)
2. Kích hoạt Google Drive API
3. Tạo OAuth 2.0 Client ID và Client Secret
4. Cập nhật thông tin trong Admin Panel > System Config

### Chatbot Integration
#### Zalo
1. Đăng ký [Zalo Official Account](https://oa.zalo.me/)
2. Tạo và cấu hình webhook URL (http://your-domain/api/chatbot/webhook/zalo)
3. Lấy Access Token và cập nhật trong Admin Panel

#### Facebook
1. Tạo [Facebook App](https://developers.facebook.com/)
2. Cấu hình Messenger webhook (http://your-domain/api/chatbot/webhook/facebook)
3. Lấy Page Access Token và cập nhật trong Admin Panel

## 🧪 Testing
### Backend API
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm run test
```

## 🚀 Deployment
### Backend API
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```
Các file build sẽ được tạo trong thư mục `dist/`

### n8n Workflow Engine
Để chạy n8n trong production, bạn nên sử dụng Docker hoặc PM2:
```bash
# Sử dụng PM2
npm install -g pm2
pm2 start "n8n start" --name "n8n"
```

## 📋 Tính Năng Đã Hoàn Thành

### ✅ Frontend
- ✅ Authentication System (JWT)
- ✅ Admin Panel
- ✅ User Dashboard
- ✅ Image Gallery
- ✅ Chatbot Interface

### ✅ Backend API
- ✅ Authentication API
- ✅ Image Management API
- ✅ Google Drive Integration API
- ✅ Chatbot Webhook API
- ✅ n8n Workflow Integration API

### ✅ n8n Workflows
- ✅ Google Drive Scanner
- ✅ DeepFace Processing
- ✅ Image Selection
- ✅ Chatbot Response

## 📝 Lưu Ý Quan Trọng
1. Đảm bảo MongoDB đang chạy trước khi khởi động Backend API
2. n8n cần được cấu hình với các credentials phù hợp cho Google Drive và DeepFace
3. Để sử dụng chatbot webhooks trong môi trường development, bạn cần sử dụng ngrok hoặc một dịch vụ tương tự để tạo public URL

## 🔍 Troubleshooting

### Lỗi Phổ Biến và Cách Khắc Phục:

**1. MongoDB Connection Error:**
- Kiểm tra MongoDB đang chạy: `mongod --version`
- Kiểm tra URI kết nối trong file `.env`
- Đảm bảo port 27017 không bị chiếm bởi ứng dụng khác

**2. Frontend không kết nối được Backend:**
- Kiểm tra Backend đang chạy tại port 5000
- Kiểm tra CORS settings trong backend/src/index.ts
- Đảm bảo VITE_API_BASE_URL đúng trong frontend/.env

**3. n8n Workflow Execution Error:**
- Kiểm tra logs trong n8n UI
- Đảm bảo các credentials đã được cấu hình đúng
- Kiểm tra n8n có quyền truy cập các API external

**4. DeepFace/Python Environment Error:**
- Kích hoạt virtual environment: `source .venv/bin/activate` (Linux/Mac) hoặc `.venv\Scripts\activate` (Windows)
- Cài đặt lại dependencies: `pip install -r backend/scripts/python/requirements-minimal.txt`
- Kiểm tra Python version: `python --version` (nên >= 3.8)

**5. Google Drive API Error:**
- Kiểm tra credentials Google Drive đã được setup đúng
- Đảm bảo OAuth 2.0 redirect URI đã được thêm: `http://localhost:5000/api/drive/oauth2callback`
- Kiểm tra Google Drive API đã được enable trong Google Cloud Console

**6. Port Already in Use:**
```bash
# Kiểm tra process đang sử dụng port
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Kill process nếu cần
taskkill /PID <process_id> /F  # Windows
kill -9 <process_id>           # Mac/Linux
```

---

**Latest Updates**: 
1. ✅ **Frontend hoàn thành** - Chạy trên port 3000
2. ✅ **n8n Backend workflows hoàn thành**
3. ✅ **API Integration hoàn thành**
4. ✅ **Documentation cập nhật** - README.md đầy đủ cho từng module
5. 🔄 **Deploy to production**
6. 🔄 **User testing and feedback** 

**Tài Khoản Mặc Định**:
- **Admin**: `admin@example.com` / `admin123` (role: admin)
- **User**: `user@example.com` / `user123` (role: user)