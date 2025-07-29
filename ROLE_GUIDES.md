# 👥 Hướng Dẫn Chi Tiết Cho Từng Vai Trò

## 🎯 Backend Developer Guide

### 📋 Trách Nhiệm Chính
- Setup và maintain Express server
- Implement RESTful APIs
- Database design và management
- AI integration (DeepFace)
- Security implementation
- API documentation

### 🛠️ Tech Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **File Upload**: Multer
- **Testing**: Jest + Supertest
- **AI**: DeepFace (Python integration)

### 📁 Cấu Trúc Code Cần Tạo

#### Phase 1: Foundation (Tuần 1-2)
```bash
# Commit 1: Project Structure
git checkout -b feature/initial-project-structure
# Tạo cấu trúc thư mục cơ bản
git add .
git commit -m "feat: Initialize project structure with basic folders"
git push origin feature/initial-project-structure
```

**Files cần tạo:**
```
backend/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── src/
    ├── app.ts
    ├── server.ts
    ├── config/
    │   ├── database.ts
    │   └── environment.ts
    ├── middleware/
    │   ├── cors.ts
    │   ├── errorHandler.ts
    │   └── auth.ts
    ├── models/
    │   └── User.ts
    ├── controllers/
    │   └── authController.ts
    ├── routes/
    │   └── authRoutes.ts
    └── services/
        └── authService.ts
```

#### Phase 3: Core Features (Tuần 3-4)
```bash
# Commit 7: Image Management
git checkout -b feature/image-management-api
# Implement image upload và management
git commit -m "feat: Implement image upload and management API"
```

**Files cần tạo:**
```
backend/src/
├── models/
│   └── Image.ts
├── controllers/
│   └── imageController.ts
├── routes/
│   └── imageRoutes.ts
├── middleware/
│   └── upload.ts
└── services/
    └── imageService.ts
```

### 🔧 Setup Development Environment

#### 1. Install Dependencies
```bash
cd backend
npm install express mongoose cors helmet bcryptjs jsonwebtoken multer dotenv
npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/multer nodemon ts-node
```

#### 2. Configure TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 3. Environment Variables
```bash
# .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-photo-management
JWT_SECRET=your_jwt_secret_key_here
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key_here
GOOGLE_DRIVE_CLIENT_ID=your_google_client_id_here
GOOGLE_DRIVE_CLIENT_SECRET=your_google_client_secret_here
UPLOAD_DIR=./uploads
```

### 📝 Code Examples

#### User Model (models/User.ts)
```typescript
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
```

#### Auth Controller (controllers/authController.ts)
```typescript
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ email, password, name });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

### 🧪 Testing Strategy

#### Unit Tests
```typescript
// tests/unit/auth.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { User } from '../../src/models/User';

describe('Auth API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });
  });
});
```

### 📊 Performance Monitoring
- Use Winston for logging
- Implement request rate limiting
- Monitor database query performance
- Setup error tracking với Sentry

---

## 🎨 Frontend Developer Guide

### 📋 Trách Nhiệm Chính
- Vue.js 3 development với Composition API
- UI/UX implementation
- State management với Pinia
- API integration
- Responsive design
- Component testing

### 🛠️ Tech Stack
- **Framework**: Vue.js 3 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Element Plus
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Testing**: Vitest + Vue Test Utils

### 📁 Cấu Trúc Code Cần Tạo

#### Phase 2: Foundation (Tuần 2-3)
```bash
# Commit 4: Vue.js Setup
git checkout -b feature/vue-setup
# Setup Vue.js 3 với TypeScript
git commit -m "feat: Setup Vue.js 3 with TypeScript and Vite"
```

**Files cần tạo:**
```
frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.ts
    ├── App.vue
    ├── router/
    │   └── index.ts
    ├── stores/
    │   └── auth.ts
    ├── services/
    │   └── api.ts
    ├── components/
    │   ├── Layout/
    │   │   ├── AppHeader.vue
    │   │   ├── AppSidebar.vue
    │   │   └── AppFooter.vue
    │   └── UI/
    │       ├── Button.vue
    │       └── Input.vue
    └── views/
        ├── Home.vue
        ├── Login.vue
        └── Register.vue
```

#### Phase 4: Core Features (Tuần 4-5)
```bash
# Commit 10: Admin Dashboard
git checkout -b feature/admin-dashboard
# Implement admin dashboard
git commit -m "feat: Create admin dashboard with system overview"
```

**Files cần tạo:**
```
frontend/src/
├── views/
│   └── Admin/
│       ├── Dashboard.vue
│       ├── UserManagement.vue
│       └── SystemConfig.vue
├── components/
│   └── Admin/
│       ├── StatsCard.vue
│       ├── UserTable.vue
│       └── SystemStatus.vue
└── stores/
    └── admin.ts
```

### 🔧 Setup Development Environment

#### 1. Install Dependencies
```bash
cd frontend
npm install vue@next vue-router@4 pinia axios element-plus
npm install -D typescript @vitejs/plugin-vue vite @types/node
```

#### 2. Configure Vite
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

#### 3. Environment Variables
```bash
# .env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_TITLE=Smart Photo Management
```

### 📝 Code Examples

#### Main App (App.vue)
```vue
<template>
  <div id="app">
    <el-container>
      <el-header>
        <AppHeader />
      </el-header>
      <el-container>
        <el-aside width="200px" v-if="isAuthenticated">
          <AppSidebar />
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AppHeader from '@/components/Layout/AppHeader.vue';
import AppSidebar from '@/components/Layout/AppSidebar.vue';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>
```

#### Auth Store (stores/auth.ts)
```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/authService';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  const login = async (email: string, password: string) => {
    try {
      loading.value = true;
      const response = await authService.login(email, password);
      token.value = response.token;
      user.value = response.user;
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  };

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      token.value = savedToken;
      // Verify token and get user info
    }
  };

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    initializeAuth,
  };
});
```

#### Login Component (components/Auth/LoginForm.vue)
```vue
<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="120px"
    class="login-form"
  >
    <el-form-item label="Email" prop="email">
      <el-input
        v-model="form.email"
        type="email"
        placeholder="Enter your email"
      />
    </el-form-item>

    <el-form-item label="Password" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="Enter your password"
        show-password
      />
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleLogin"
      >
        Login
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formRef = ref();
const loading = ref(false);

const form = reactive({
  email: '',
  password: '',
});

const rules = {
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Please enter valid email', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
};

const handleLogin = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;
    
    await authStore.login(form.email, form.password);
    ElMessage.success('Login successful');
    router.push('/dashboard');
  } catch (error) {
    ElMessage.error(error.message || 'Login failed');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
</style>
```

### 🧪 Testing Strategy

#### Component Tests
```typescript
// tests/components/LoginForm.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from '@/components/Auth/LoginForm.vue';

describe('LoginForm', () => {
  it('should emit login event with form data', async () => {
    const wrapper = mount(LoginForm);
    
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('button').trigger('click');
    
    // Add assertions based on your implementation
  });
});
```

---

## 🔄 Workflow Developer Guide

### 📋 Trách Nhiệm Chính
- n8n workflow development
- Automation logic design
- AI processing workflows
- Chatbot integration
- Workflow testing và optimization

### 🛠️ Tech Stack
- **Workflow Engine**: n8n
- **AI Processing**: DeepFace (Python)
- **Chatbot Platforms**: Zalo, Facebook Messenger
- **Storage**: Google Drive API
- **Notifications**: Email, SMS, Push notifications

### 📁 Cấu Trúc Code Cần Tạo

#### Phase 5: Workflow Development (Tuần 5-6)
```bash
# Commit 13: Core Workflows
git checkout -b feature/core-workflows
# Setup core n8n workflows
git commit -m "feat: Setup core n8n workflows for automation"
```

**Files cần tạo:**
```
n8n-workflows/
├── core-workflows/
│   ├── google-drive-scanner.json
│   ├── image-processor.json
│   └── notification-sender.json
├── ai-integration/
│   ├── face-detection.json
│   ├── image-selection.json
│   └── quality-assessment.json
├── chatbot-integration/
│   ├── zalo-bot.json
│   ├── facebook-bot.json
│   └── message-processor.json
└── scripts/
    └── ai-processor.py
```

### 🔧 Setup Development Environment

#### 1. Install n8n
```bash
# Using npm
npm install -g n8n

# Or using Python
pip install n8n

# Start n8n
n8n start
```

#### 2. Environment Variables
```bash
# .env
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your_api_key_here
GOOGLE_DRIVE_CLIENT_ID=your_google_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_google_client_secret
DEEPFACE_API_URL=http://localhost:8000
ZALO_ACCESS_TOKEN=your_zalo_token
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_token
```

### 📝 Workflow Examples

#### Google Drive Scanner Workflow
```json
{
  "name": "Google Drive Scanner",
  "nodes": [
    {
      "parameters": {
        "resource": "file",
        "operation": "list",
        "folderId": "{{ $json.folderId }}",
        "q": "mimeType contains 'image/'"
      },
      "id": "google-drive-scanner",
      "name": "Scan Google Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 2,
      "position": [240, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "id": "new-files",
              "leftValue": "{{ $json.files.length }}",
              "rightValue": 0,
              "operator": {
                "type": "number",
                "operation": "gt"
              }
            }
          ],
          "combinator": "and"
        }
      },
      "id": "check-new-files",
      "name": "Check New Files",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [460, 300]
    }
  ],
  "connections": {
    "Scan Google Drive": {
      "main": [
        [
          {
            "node": "Check New Files",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

#### AI Processing Workflow
```json
{
  "name": "AI Image Processing",
  "nodes": [
    {
      "parameters": {
        "url": "={{ $json.downloadUrl }}",
        "options": {}
      },
      "id": "download-image",
      "name": "Download Image",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3.1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "url": "{{ $env.DEEPFACE_API_URL }}/analyze",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "{\n  \"image\": \"{{ $json.data }}\"\n}",
        "options": {}
      },
      "id": "deepface-analysis",
      "name": "DeepFace Analysis",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3.1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "jsCode": "// Process AI results\nconst analysis = $input.all()[0].json;\nconst quality = analysis.quality || 0;\nconst faces = analysis.faces || [];\n\nreturn {\n  quality,\n  faceCount: faces.length,\n  bestImage: quality > 0.7,\n  analysis\n};"
      },
      "id": "process-results",
      "name": "Process Results",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300]
    }
  ],
  "connections": {
    "Download Image": {
      "main": [
        [
          {
            "node": "DeepFace Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "DeepFace Analysis": {
      "main": [
        [
          {
            "node": "Process Results",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### 🧪 Testing Strategy

#### Workflow Testing
```typescript
// tests/workflows/google-drive-scanner.test.ts
import { describe, it, expect } from 'vitest';
import { executeWorkflow } from '@/utils/workflow-testing';

describe('Google Drive Scanner Workflow', () => {
  it('should detect new images in Google Drive', async () => {
    const result = await executeWorkflow('google-drive-scanner', {
      folderId: 'test-folder-id',
    });

    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('files');
  });
});
```

---

## 🔧 Full Stack Developer Guide

### 📋 Trách Nhiệm Chính
- API integration giữa frontend và backend
- Real-time features implementation
- Testing và bug fixes
- Performance optimization
- Code review và quality assurance

### 🛠️ Tech Stack
- **Frontend**: Vue.js 3 + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Real-time**: WebSocket + Socket.io
- **Testing**: Jest + Vitest + Cypress
- **Performance**: Lighthouse, Webpack Bundle Analyzer

### 📁 Cấu Trúc Code Cần Tạo

#### Phase 6: Integration (Tuần 6-7)
```bash
# Commit 16: API Integration
git checkout -b feature/api-integration
# Integrate all APIs
git commit -m "feat: Integrate all APIs and services"
```

**Files cần tạo:**
```
backend/src/
├── services/
│   └── n8nService.ts
├── controllers/
│   └── workflowController.ts
└── routes/
    └── workflowRoutes.ts

frontend/src/
├── services/
│   ├── websocket.ts
│   └── realtime.ts
└── components/
    └── RealTime/
        ├── NotificationCenter.vue
        └── StatusIndicator.vue
```

### 🔧 Setup Development Environment

#### 1. WebSocket Integration
```typescript
// backend/src/websocket/server.ts
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const setupWebSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`Client ${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};
```

#### 2. Real-time Notifications
```typescript
// backend/src/services/notificationService.ts
import { Server } from 'socket.io';

export class NotificationService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public notifyUser(userId: string, notification: any) {
    this.io.to(`user-${userId}`).emit('notification', notification);
  }

  public notifyAdmins(notification: any) {
    this.io.to('admins').emit('admin-notification', notification);
  }

  public broadcastSystemUpdate(update: any) {
    this.io.emit('system-update', update);
  }
}
```

### 📝 Code Examples

#### API Service Integration
```typescript
// frontend/src/services/api.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Real-time Component
```vue
<!-- frontend/src/components/RealTime/NotificationCenter.vue -->
<template>
  <div class="notification-center">
    <el-badge :value="unreadCount" class="notification-badge">
      <el-button
        icon="Bell"
        circle
        @click="showNotifications = true"
      />
    </el-badge>

    <el-dialog
      v-model="showNotifications"
      title="Notifications"
      width="400px"
    >
      <div class="notification-list">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.read }"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const notifications = ref<Notification[]>([]);
const unreadCount = ref(0);
const showNotifications = ref(false);

const { socket, connected } = useWebSocket();

const markAsRead = (id: string) => {
  const notification = notifications.value.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    updateUnreadCount();
  }
};

const updateUnreadCount = () => {
  unreadCount.value = notifications.value.filter(n => !n.read).length;
};

const formatTime = (date: Date) => {
  return new Date(date).toLocaleString();
};

onMounted(() => {
  if (socket) {
    socket.on('notification', (notification: Notification) => {
      notifications.value.unshift(notification);
      updateUnreadCount();
    });
  }
});

onUnmounted(() => {
  if (socket) {
    socket.off('notification');
  }
});
</script>

<style scoped>
.notification-center {
  position: relative;
}

.notification-badge {
  margin-right: 20px;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.notification-item:hover {
  background-color: #f5f5f5;
}

.notification-item.unread {
  background-color: #f0f9ff;
}

.notification-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.notification-message {
  color: #666;
  margin-bottom: 5px;
}

.notification-time {
  font-size: 12px;
  color: #999;
}
</style>
```

### 🧪 Testing Strategy

#### Integration Tests
```typescript
// tests/integration/api.test.ts
import request from 'supertest';
import { app } from '@/app';
import { User } from '@/models/User';

describe('API Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    // Setup test user
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = response.body.token;
  });

  it('should upload image and process with AI', async () => {
    const response = await request(app)
      .post('/api/images/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('image', 'tests/fixtures/test-image.jpg');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('aiAnalysis');
  });
});
```

---

## 🚀 DevOps Engineer Guide

### 📋 Trách Nhiệm Chính
- Production deployment setup
- CI/CD pipeline implementation
- Monitoring và logging
- Security configuration
- Performance optimization

### 🛠️ Tech Stack
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Security**: SSL/TLS, Rate limiting, CORS

### 📁 Cấu Trúc Code Cần Tạo

#### Phase 7: Production Deployment (Tuần 7-8)
```bash
# Commit 19: Production Configuration
git checkout -b feature/production-deployment
# Setup production configuration
git commit -m "feat: Setup production configuration and deployment"
```

**Files cần tạo:**
```
/
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── scripts/
│   ├── deploy.sh
│   └── setup.sh
└── monitoring/
    ├── prometheus.yml
    └── grafana/
        └── dashboards/
```

### 🔧 Setup Development Environment

#### 1. Docker Configuration
```dockerfile
# docker/Dockerfile.backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY .env ./

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

```dockerfile
# docker/Dockerfile.frontend
FROM nginx:alpine

COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: ../docker/Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/smart-photo-management
    depends_on:
      - mongo

  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=admin123

volumes:
  mongo_data:
```

#### 2. CI/CD Pipeline
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        cd backend && npm install
        cd ../frontend && npm install
    
    - name: Run tests
      run: |
        cd backend && npm test
        cd ../frontend && npm run test
    
    - name: Build
      run: |
        cd backend && npm run build
        cd ../frontend && npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # Add your deployment commands here
```

### 📝 Code Examples

#### Deployment Script
```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Starting deployment..."

# Build Docker images
echo "📦 Building Docker images..."
docker-compose -f docker-compose.yml build

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.yml down

# Start new containers
echo "▶️ Starting new containers..."
docker-compose -f docker-compose.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Run health checks
echo "🏥 Running health checks..."
curl -f http://localhost:5000/api/health || exit 1
curl -f http://localhost:80 || exit 1

echo "✅ Deployment completed successfully!"
```

#### Monitoring Configuration
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'backend'
    static_configs:
      - targets: ['backend:5000']
    metrics_path: '/metrics'

  - job_name: 'frontend'
    static_configs:
      - targets: ['frontend:80']
    metrics_path: '/metrics'

  - job_name: 'n8n'
    static_configs:
      - targets: ['n8n:5678']
    metrics_path: '/metrics'
```

### 🧪 Testing Strategy

#### Load Testing
```typescript
// tests/load/api-load.test.ts
import { check } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function() {
  const response = http.get('http://localhost:5000/api/health');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

---

## 📞 Communication & Collaboration

### Daily Standup Format
```
Date: [Date]
Attendees: [Team members]

Updates:
- [Name]: Completed [task], working on [next task], blocked by [issue]

Decisions:
- [Decision made]

Action Items:
- [Action item] - [Owner] - [Due date]
```

### Git Workflow
```bash
# Feature development
git checkout -b feature/feature-name
# Make changes
git add .
git commit -m "feat: Add feature description"
git push origin feature/feature-name

# Create Pull Request
# Review code
# Merge to main
```

### Code Review Checklist
- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Error handling implemented

---

**Lưu ý**: Mỗi vai trò nên có ít nhất một người backup để đảm bảo continuity trong trường hợp có người nghỉ hoặc chuyển công việc.