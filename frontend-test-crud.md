# 🧪 Frontend CRUD Test Instructions

## ✅ Các Thay Đổi Đã Thực Hiện:

### 🔧 **Vấn đề tìm thấy:**
- Backend trả về `_id` (MongoDB format)
- Frontend expect `id` field
- `deleteUser(row.id)` và `updateUser(editingUser.value.id)` nhận undefined

### 🛠 **Giải pháp đã implement:**
- Transform data trong `loadUsers()`: map `_id` → `id` 
- Giữ nguyên User interface với `id: string`
- Frontend code vẫn sử dụng `row.id` và `editingUser.value.id`

## 🚀 Test Manual

### 1. **Khởi động servers:**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend  
npm run dev
```

### 2. **Login Admin:**
- Truy cập: http://localhost:3000/login
- Username: `admin`
- Password: `admin123`

### 3. **Test User Management:**
- Vào Admin Dashboard → User Management
- **Kiểm tra danh sách users hiển thị**

### 4. **Test CREATE:**
- Click "Add New User"
- Fill form:
  - Username: `testuser123`
  - Email: `test123@example.com` 
  - Role: `user`
  - Password: `password123`
- Click "Create"
- **✅ Verify:** Success message + user xuất hiện trong list

### 5. **Test UPDATE:**
- Click Edit button trên user vừa tạo
- Thay đổi:
  - Email: `updated123@example.com`
  - Role: `admin`
- Click "Update"
- **✅ Verify:** Success message + thông tin mới hiển thị

### 6. **Test DELETE:**
- Click Delete button trên user vừa edit
- Confirm trong dialog
- **✅ Verify:** Success message + user biến mất

## 🔍 Debug Console

**Mở F12 → Console Tab và kiểm tra:**

### Expected Console Logs:
```javascript
// Khi load users
Loaded users: 5

// Khi create user  
Create user response: {data: {id: "...", username: "testuser123", ...}}

// Khi update user
Update user response: {data: {id: "...", username: "testuser123", ...}}

// Khi delete user  
User deleted successfully
Loaded users: 4
```

### ❌ Nếu có lỗi, check:
- Network tab: API calls status codes
- Console errors màu đỏ
- Response data format

## 🧪 Test với Browser DevTools

### Network Tab Analysis:
```bash
# Expected API calls khi test:

GET /api/auth/users?page=1&limit=100
Response: {success: true, data: {data: [...], total: X}}

POST /api/auth/users  
Request: {username: "...", email: "...", role: "...", password: "..."}
Response: {success: true, data: {_id: "...", username: "...", ...}}

PUT /api/auth/users/{id}
Request: {username: "...", email: "...", role: "..."}  
Response: {success: true, data: {_id: "...", username: "...", ...}}

DELETE /api/auth/users/{id}
Response: {success: true, message: "User deleted successfully"}
```

## 🎯 Success Criteria

- [ ] Load users: Danh sách hiển thị đúng
- [ ] Create user: Form submit thành công  
- [ ] Update user: Thay đổi thông tin thành công
- [ ] Delete user: Xóa thành công
- [ ] UI feedback: Success/error messages hiển thị
- [ ] Console: Không có error màu đỏ
- [ ] Network: API calls trả về 200/201 status

**🎉 Nếu tất cả pass → CRUD operations hoạt động hoàn hảo!**
