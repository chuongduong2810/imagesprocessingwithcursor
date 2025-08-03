# 💪 Gym Personal Trainer

Ứng dụng web luyện tập gym cá nhân được xây dựng bằng React, TypeScript, và TailwindCSS.

## 🎯 Tính năng chính

### ✅ Đã hoàn thành
- **Dashboard cá nhân**: Hiển thị thông tin người dùng, thống kê tập luyện
- **Hồ sơ người dùng**: Quản lý thông tin cá nhân, BMI calculator
- **Thư viện bài tập**: 
  - Tích hợp API ExerciseDB (có fallback mock data)
  - Tìm kiếm và lọc bài tập theo nhóm cơ, thiết bị
  - Lưu bài tập yêu thích
  - Xem chi tiết bài tập với hình ảnh và hướng dẫn
- **Theo dõi tiến độ**:
  - Biểu đồ hoạt động tập luyện
  - Thống kê tổng hợp
  - Lịch sử tập luyện
- **Dark mode**: Chuyển đổi giao diện sáng/tối
- **Responsive design**: Tối ưu cho mobile và desktop
- **Local Storage**: Lưu trữ dữ liệu người dùng

### 🚧 Đang phát triển
- **Workout Planner**: Tạo kế hoạch tập luyện chi tiết
- **Ghi nhận buổi tập**: Theo dõi chi tiết từng buổi tập
- **Cá nhân hóa**: Gợi ý bài tập dựa trên mục tiêu
- **Đo đạc cơ thể**: Ghi nhận tiến độ cân nặng, số đo

## 🛠 Công nghệ sử dụng

- **Frontend**: React 18, TypeScript
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **Icons**: Heroicons
- **Charts**: Recharts
- **API**: ExerciseDB (với mock data fallback)
- **Storage**: localStorage

## 📦 Cài đặt

1. **Clone dự án**:
```bash
git clone <repository-url>
cd gym-personal-trainer
```

2. **Cài đặt dependencies**:
```bash
npm install
```

3. **Tạo file environment** (tùy chọn):
```bash
# Tạo file .env.local
REACT_APP_RAPIDAPI_KEY=your_rapidapi_key_here
```
*Lưu ý: Nếu không có API key, ứng dụng sẽ sử dụng mock data*

4. **Chạy ứng dụng**:
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 🚀 Cách sử dụng

1. **Đầu tiên**: Tạo hồ sơ cá nhân tại trang "Hồ sơ"
2. **Khám phá**: Duyệt thư viện bài tập và lưu yêu thích
3. **Theo dõi**: Xem tiến độ và thống kê tại trang "Tiến độ"

## 📱 Giao diện

- **Responsive**: Hoạt động tốt trên mobile và desktop
- **Dark mode**: Chuyển đổi theme sáng/tối
- **Modern UI**: Giao diện hiện đại với TailwindCSS

## 🗂 Cấu trúc dự án

```
src/
├── components/          # UI components tái sử dụng
│   └── Layout.tsx      # Layout chính với navigation
├── pages/              # Các trang chính
│   ├── Dashboard.tsx   # Trang chủ
│   ├── ExerciseLibrary.tsx # Thư viện bài tập
│   ├── WorkoutPlanner.tsx  # Lên lịch tập (đang phát triển)
│   ├── Progress.tsx    # Theo dõi tiến độ
│   └── Profile.tsx     # Hồ sơ người dùng
├── context/            # React contexts
│   └── ThemeContext.tsx # Quản lý dark mode
├── services/           # API services
│   └── exerciseApi.ts  # Gọi API bài tập
├── types/              # TypeScript type definitions
│   └── index.ts        # Tất cả types
├── utils/              # Utility functions
│   └── storage.ts      # localStorage helpers
└── hooks/              # Custom React hooks (dự phòng)
```

## 🔧 Scripts

- `npm start`: Chạy development server
- `npm build`: Build production
- `npm test`: Chạy tests
- `npm run eject`: Eject từ create-react-app

## 🌐 API

Ứng dụng sử dụng [ExerciseDB API](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb) để lấy dữ liệu bài tập.

**Thiết lập API** (tùy chọn):
1. Đăng ký tại RapidAPI
2. Subscribe ExerciseDB API
3. Thêm API key vào `.env.local`

**Mock Data**: Nếu không có API key, ứng dụng sử dụng mock data với 6 bài tập cơ bản.

## 💾 Lưu trữ dữ liệu

Ứng dụng sử dụng localStorage để lưu:
- Thông tin người dùng
- Bài tập yêu thích
- Lịch sử tập luyện
- Thiết lập dark mode

## 🎨 Customization

### Màu sắc
Chỉnh sửa trong `tailwind.config.js`:
```js
colors: {
  primary: { ... },
  secondary: { ... }
}
```

### Components
Tất cả components được thiết kế tái sử dụng và dễ customize.

## 🚀 Roadmap

### Phase 2
- [ ] Workout builder chi tiết
- [ ] Timer cho buổi tập
- [ ] Ghi nhận sets/reps/weights
- [ ] Export/import data

### Phase 3
- [ ] Social features (chia sẻ tiến độ)
- [ ] Workout plans template
- [ ] Nutrition tracking
- [ ] Progressive web app (PWA)

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file `LICENSE` để biết thêm chi tiết.

## 👥 Tác giả

Được phát triển với ❤️ bởi Claude & Human collaboration

---

**Lưu ý**: Đây là phiên bản MVP (Minimum Viable Product) của ứng dụng. Nhiều tính năng đang được phát triển và sẽ được bổ sung trong các phiên bản tiếp theo.
