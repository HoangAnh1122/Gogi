# 🎨 Frontend - Hệ Thống Quản Lý Ảnh Thông Minh

Ứng dụng frontend hiện đại cho hệ thống quản lý ảnh thông minh, được xây dựng với Vue 3, TypeScript, Vite và Element Plus. Cung cấp giao diện người dùng trực quan cho admin và user với đầy đủ tính năng quản lý ảnh AI.

## 📋 Tổng Quan Công Nghệ

- **Framework**: Vue 3 + Composition API + TypeScript
- **Build Tool**: Vite (⚡ Fast HMR & Build)
- **UI Framework**: Element Plus + Icons
- **State Management**: Pinia (Vue 3 Store)
- **Router**: Vue Router 4 với Authentication Guards
- **HTTP Client**: Axios với Interceptors
- **Progress**: NProgress cho loading indicators
- **Development**: Hot Module Replacement (HMR)

## 🏗️ Cấu Trúc Dự Án

```
frontend/
├── src/
│   ├── assets/           # Static assets (CSS, images)
│   ├── components/       # Reusable Vue components
│   │   ├── common/       # Common UI components
│   │   ├── forms/        # Form components
│   │   └── ui/           # UI-specific components
│   ├── layouts/          # Layout components
│   │   ├── AdminLayout.vue    # Admin dashboard layout
│   │   ├── UserLayout.vue     # User interface layout
│   │   └── AuthLayout.vue     # Authentication layout
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   │   ├── AdminDashboard.vue    # Admin overview
│   │   │   ├── UserManagement.vue    # User CRUD
│   │   │   ├── WorkflowManagement.vue # n8n Workflows
│   │   │   ├── SystemConfig.vue      # System settings
│   │   │   └── DriveExplorer.vue     # Google Drive browser
│   │   ├── user/         # User pages
│   │   │   ├── UserDashboard.vue     # User overview
│   │   │   ├── ImageGallery.vue      # Photo gallery
│   │   │   └── ChatbotInterface.vue  # AI Chatbot
│   │   ├── auth/         # Authentication pages
│   │   │   ├── LoginPage.vue         # Login form
│   │   │   └── RegisterPage.vue      # Registration form
│   ├── router/           # Vue Router configuration
│   │   └── index.ts      # Routes & navigation guards
│   ├── services/         # API & Business logic
│   │   ├── api.ts        # Main API client
│   │   ├── auth.ts       # Authentication service
│   │   └── images.ts     # Image management service
│   ├── stores/           # Pinia state management
│   │   ├── auth.ts       # Authentication state
│   │   ├── images.ts     # Images state
│   │   └── workflows.ts  # Workflows state
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts      # All interfaces & types
│   ├── utils/            # Utility functions
│   ├── main.ts           # Application entry point
│   ├── App.vue           # Root component
│   └── env.d.ts          # Environment type definitions
├── public/               # Static public assets
│   ├── index.html        # HTML template
│   └── favicon.ico       # App favicon
├── dist/                 # Production build output
├── node_modules/         # Dependencies
├── package.json          # Node.js dependencies & scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── jsconfig.json         # JavaScript configuration
└── README.md            # This documentation
```

## ⚙️ Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống
- Node.js >= 16.x
- npm >= 8.x hoặc yarn >= 1.22.x
- Modern browser (Chrome 87+, Firefox 78+, Safari 14+)

### 1. Cài Đặt Dependencies

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies với npm
npm install

# Hoặc với yarn
yarn install
```

### 2. Cấu Hình Environment Variables

Tạo file `.env` trong thư mục frontend:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Development Options
VITE_USE_MOCK_API=false

# App Configuration  
VITE_APP_NAME=Smart Photo Manager
VITE_APP_VERSION=1.0.0
```

### 3. Khởi Động Development Server

```bash
# Development mode với HMR
npm run dev

# Development với network access
npm run dev -- --host

# Preview production build
npm run preview
```

Frontend sẽ chạy tại: **http://localhost:3000**

### 4. Build cho Production

```bash
# Build optimized production files
npm run build

# Build và preview
npm run build && npm run preview
```

## 🔐 Authentication & Authorization

### Hệ Thống Phân Quyền

#### Admin Role (`admin`)
- **Dashboard**: Thống kê tổng quan hệ thống
- **User Management**: CRUD người dùng, phân quyền
- **Workflow Management**: Quản lý n8n workflows
- **System Configuration**: Cấu hình Google Drive, API keys
- **Drive Explorer**: Duyệt và quét Google Drive folders

#### User Role (`user`)
- **Dashboard**: Thống kê cá nhân, recent activities
- **Image Gallery**: Xem ảnh đã xử lý, download
- **Chatbot Interface**: Tương tác với AI chatbot

### Navigation Guards
```typescript
// Protected routes require authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.role && to.meta.role !== userRole) {
    next('/login') // Redirect if insufficient permissions
  } else {
    next()
  }
})
```

## 🖼️ Tính Năng Chi Tiết

### 1. Admin Dashboard
- **System Statistics**: Users, images, workflows count
- **Recent Activities**: Latest uploads, processed images
- **Performance Metrics**: AI processing times, success rates
- **Quick Actions**: Direct access to key management functions

### 2. Image Gallery
- **Grid/List View**: Responsive layout with lazy loading
- **Filters**: By date, status, face detection, quality score
- **Bulk Operations**: Select multiple images for batch actions
- **AI Analysis Results**: Face detection, emotion analysis
- **Download**: Individual or batch download

### 3. Chatbot Interface
- **Real-time Chat**: WebSocket-based instant messaging
- **Image Upload**: Drag & drop or click to upload
- **AI Responses**: Powered by Google Gemini AI
- **Message History**: Persistent conversation storage
- **Typing Indicators**: Real-time typing status

### 4. Drive Explorer
- **Folder Browser**: Navigate Google Drive structure
- **File Preview**: Thumbnail previews for images
- **Batch Scan**: Select multiple folders for AI processing
- **Upload Progress**: Real-time upload status tracking

### 5. Workflow Management
- **n8n Integration**: Visual workflow editor
- **Workflow Templates**: Pre-built common workflows
- **Execution History**: Track workflow runs and results
- **Real-time Status**: Live workflow execution monitoring

## 🎨 UI/UX Design System

### Element Plus Components
- **Forms**: el-form với validation rules
- **Tables**: el-table với sorting, pagination
- **Dialogs**: el-dialog cho modals
- **Messages**: el-message cho notifications
- **Loading**: el-loading cho async operations

### Design Tokens
```scss
// Colors
$primary-color: #409EFF;
$success-color: #67C23A;
$warning-color: #E6A23C;
$danger-color: #F56C6C;

// Spacing
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// Typography
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-md: 16px;
$font-size-lg: 18px;
$font-size-xl: 20px;
```

## 📡 API Integration

### API Client Configuration
```typescript
// services/api.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 300000, // 5 minutes for AI processing
  headers: {
    'Content-Type': 'application/json'
  }
})

// Automatic token injection
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### API Endpoints Usage
```typescript
// Authentication
await authApi.login({ username, password })
await authApi.logout()
await authApi.getCurrentUser()

// Images
await imageApi.uploadImages(files)
await imageApi.getImages({ page, limit, filters })
await imageApi.processImage(imageId)

// Drive
await driveApi.getFolders()
await driveApi.scanFolder(folderId)

// Workflows
await workflowApi.executeWorkflow(workflowId, data)
await workflowApi.getExecutionStatus(executionId)
```

## 🗄️ State Management (Pinia)

### Authentication Store
```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)
  
  const login = async (credentials: LoginRequest) => {
    // Login logic
  }
  
  const logout = () => {
    // Logout logic
  }
  
  return { user, token, isAuthenticated, login, logout }
})
```

### Images Store
```typescript
// stores/images.ts
export const useImagesStore = defineStore('images', () => {
  const images = ref<ImageFile[]>([])
  const loading = ref(false)
  const currentImage = ref<ImageFile | null>(null)
  
  const fetchImages = async (params: ImageQueryParams) => {
    // Fetch images
  }
  
  const uploadImages = async (files: File[]) => {
    // Upload images
  }
  
  return { images, loading, currentImage, fetchImages, uploadImages }
})
```


## 🔍 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Kill process using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux

# Or change port in vite.config.ts
server: {
  port: 3001,
  host: true
}
```

**2. API Connection Issues**
- Kiểm tra backend đang chạy tại port 5000
- Verify VITE_API_BASE_URL trong file `.env`
- Check network/firewall settings

**3. Build Errors**
```bash
# Clear node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npx vite --force
```

**4. TypeScript Errors**
```bash
# Run type checking
npm run type-check

# Check tsconfig.json configuration
# Ensure all types are properly imported
```

### Performance Optimization

**1. Image Loading**
- Implement lazy loading for image gallery
- Use proper image formats (WebP, AVIF)
- Optimize image sizes for different screen resolutions

**2. Bundle Size**
- Analyze bundle với `npm run build -- --analyze`
- Implement dynamic imports cho large components
- Remove unused Element Plus components

**3. API Calls**
- Implement request caching
- Use debouncing cho search inputs
- Implement pagination cho large datasets

## 🚀 Deployment

### Production Build
```bash
# Build optimized files
npm run build

# Files sẽ được tạo trong thư mục dist/
# Deploy dist/ folder lên web server
```

### Static Hosting (Netlify, Vercel)
```bash
# Build command
npm run build

# Publish directory
dist

# Redirect rules for SPA (in public/_redirects)
/*    /index.html   200
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables cho Production
```env
# Production API URL
VITE_API_BASE_URL=https://api.yourdomain.com/api

# Production optimizations
VITE_USE_MOCK_API=false
VITE_ENABLE_DEVTOOLS=false
```

---

**Lần cập nhật cuối**: $(date)
**Version**: 1.0.0
**Tech Stack**: Vue 3 + TypeScript + Vite + Element Plus
**Maintainer**: Smart Photo Management Team
