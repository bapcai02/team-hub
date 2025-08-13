# Settings Module

Module cài đặt hoàn chỉnh cho ứng dụng TeamHub với hỗ trợ đa ngôn ngữ (i18n).

## Tính năng

### 1. Profile Settings
- Cập nhật thông tin cá nhân
- Upload ảnh đại diện
- Quản lý thông tin liên lạc

### 2. App Settings
- Cài đặt ngôn ngữ (EN, VI, JA, KO, ZH)
- Cài đặt múi giờ
- Chọn theme (Light, Dark, Auto)
- Cài đặt layout (Comfortable, Compact)
- Thu gọn sidebar

### 3. Notification Settings
- Cài đặt thông báo email
- Thông báo đẩy
- Thông báo SMS
- Thông báo trong ứng dụng
- Giờ yên lặng
- Tần suất thông báo

### 4. Security Settings
- Đổi mật khẩu
- Xác thực hai yếu tố
- Lịch sử đăng nhập
- Thiết bị tin cậy
- Thời gian chờ phiên

### 5. Privacy Settings
- Hiển thị hồ sơ
- Trạng thái hoạt động
- Chia sẻ dữ liệu
- Theo dõi phân tích
- Thời gian lưu trữ dữ liệu
- Tùy chọn liên lạc

### 6. Accessibility Settings
- Độ tương phản cao
- Cỡ chữ
- Khoảng cách dòng
- Giảm chuyển động
- Hỗ trợ trình đọc màn hình
- Phím tắt
- Giao diện đơn giản

### 7. Data Management
- Xuất dữ liệu
- Nhập dữ liệu
- Xóa tài khoản

### 8. Account Information
- Hiển thị thông tin tài khoản
- Trạng thái xác thực
- Vai trò và quyền hạn
- Lịch sử hoạt động

## Cấu trúc Files

```
src/pages/settings/
├── Settings.tsx                 # Component chính
├── components/
│   ├── ProfileSettings.tsx      # Cài đặt hồ sơ
│   ├── AppSettings.tsx          # Cài đặt ứng dụng
│   ├── NotificationSettings.tsx # Cài đặt thông báo
│   ├── SecuritySettings.tsx     # Cài đặt bảo mật
│   ├── PrivacySettings.tsx      # Cài đặt riêng tư
│   ├── AccessibilitySettings.tsx # Cài đặt khả năng truy cập
│   ├── DataManagement.tsx       # Quản lý dữ liệu
│   └── AccountInfo.tsx          # Thông tin tài khoản
└── README.md                    # Hướng dẫn này
```

## Internationalization (i18n)

Tất cả text trong Settings đã được chuyển sang i18n với cấu trúc:

```json
{
  "settings": {
    "title": "Settings",
    "description": "Manage your account settings and preferences",
    "profile": { ... },
    "app": { ... },
    "notifications": { ... },
    "security": { ... },
    "privacy": { ... },
    "accessibility": { ... },
    "dataManagement": { ... },
    "accountInfo": { ... }
  }
}
```

### Ngôn ngữ hỗ trợ
- **English (en)**: `src/locales/en/translation.json`
- **Tiếng Việt (vi)**: `src/locales/vi/translation.json`

## API Endpoints

### Load Settings
```typescript
GET /settings
```

### Save Settings
```typescript
PUT /settings/{section}
```

### Export Data
```typescript
GET /settings/export
```

### Import Data
```typescript
POST /settings/import
```

## Sử dụng

```tsx
import Settings from './pages/settings/Settings';

// Trong router
<Route path="/settings" element={<Settings />} />
```

## Props Interface

```typescript
interface SettingsData {
  profile: {
    name: string;
    email: string;
    avatar: string;
    phone: string;
    birth_date: string;
    gender: string;
    bio: string;
    location: string;
  };
  app: {
    language: string;
    timezone: string;
    theme: string;
    layout: string;
    sidebar_collapsed: boolean;
    dashboard_widgets: any[];
    shortcuts: any[];
  };
  notifications: any;
  security: {
    two_factor_enabled: boolean;
    login_history: any[];
    trusted_devices: any[];
  };
  privacy: any;
  accessibility: any;
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
    status: string;
    createdAt: string;
    lastLogin: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
  };
}
```

## Tính năng nổi bật

1. **Responsive Design**: Tương thích với mọi kích thước màn hình
2. **Real-time Validation**: Kiểm tra dữ liệu ngay lập tức
3. **Auto-save**: Tự động lưu khi có thay đổi
4. **Error Handling**: Xử lý lỗi toàn diện
5. **Loading States**: Hiển thị trạng thái loading
6. **Success/Error Messages**: Thông báo rõ ràng
7. **Accessibility**: Hỗ trợ người khuyết tật
8. **Dark Mode**: Hỗ trợ chế độ tối
9. **Keyboard Navigation**: Điều hướng bằng bàn phím
10. **Data Export/Import**: Xuất nhập dữ liệu

## Dependencies

- React 18+
- Ant Design 5+
- React i18next
- Day.js
- Axios

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+ 