# Coffee Shop • Asian Modern UI (Hệ thống quản lý & hiển thị sản phẩm)

Website phong cách **Korean cafe / Japanese minimalist / Cozy coffee shop** với giao diện premium, dark mode, animation, toast notification và CRUD sản phẩm (Admin) dùng **Node.js + Express + MySQL**.

---

## Demo / Features

- Client:
  - Hero full màn hình + overlay tối nhẹ
  - Danh sách sản phẩm (card mềm mại, bo góc lớn, shadow nhẹ)
  - Tìm kiếm realtime (debounce)
  - Lọc theo **danh mục**
  - Status badge (**Còn hàng / Hết hàng**)
  - Loading screen + loading skeleton
  - Smooth scrolling + hover animation
  - Dark mode toggle (lưu vào localStorage)
  - Toast notification + popup confirm đặt hàng (demo)
- Admin:
  - Sidebar hiện đại
  - Table sản phẩm có thumbnail + badge trạng thái + actions
  - Pagination + lọc
  - Form thêm/sửa sản phẩm
  - Validate client-side (không trống, giá > 0, mô tả, danh mục)
  - Preview ảnh upload
  - Confirm xóa bằng **SweetAlert2**
  - Toast thành công/thất bại

---

## Công nghệ sử dụng

- Frontend: **HTML5, CSS3, Vanilla JS, Bootstrap 5**
- Animation/UX:
  - **AOS**
  - **SweetAlert2**
  - **ToastifyJS**
- Backend: **Node.js, Express.js (MVC)**
- Database: **MySQL**
- Upload: **multer**
- Validate: **express-validator**
- View engine: **EJS**

---

## Cấu trúc thư mục

```txt
coffee-shop/
│
├── app.js
├── package.json
├── .env.example
│
├── config/
│   └── database.js
│
├── routes/
│   ├── clientRoutes.js
│   └── adminRoutes.js
│
├── controllers/
│   ├── clientController.js
│   └── adminController.js
│
├── models/
│   └── productModel.js
│
├── middleware/
│   └── uploadMiddleware.js
│
├── public/
│   ├── css/
│   │   ├── style.css
│   │   └── admin.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   └── admin.js
│   │
│   ├── images/
│   │
│   └── uploads/
│
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── client/
│   │   └── index.ejs
│   └── admin/
│       ├── dashboard.ejs
│       └── product-form.ejs
│
├── database/
│   └── database.sql
│
└── README.md
```

---

## Hướng dẫn cài đặt

### 1) Cài dependencies

```bash
npm install
```

### 2) Tạo file cấu hình `.env`

Copy:

```bash
cp .env.example .env
```

Sửa thông tin MySQL trong `.env`:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

> Windows có thể dùng:

```bat
copy .env.example .env
```

### 3) Import database

Vào MySQL và import file:

```sql
SOURCE database/database.sql;
```

> Hoặc dùng công cụ MySQL (phpMyAdmin / MySQL Workbench).

---

## Chạy project

```bash
npm run dev
```

Mặc định:

- Client: `http://localhost:3000/client`
- Admin: `http://localhost:3000/admin`

---

## Chức năng hệ thống

### Client

- `GET /client`
  - Hiển thị danh sách sản phẩm + danh mục
- Filter:
  - `?keyword=...&category=...&status=...`

### Admin

- Dashboard:
  - `GET /admin`
- Create:
  - `GET /admin/products/new`
  - `POST /admin/products` (upload ảnh bằng multer)
- Edit:
  - `GET /admin/products/:id/edit`
  - `POST /admin/products/:id`
- Delete (AJAX):
  - `POST /admin/products/:id/delete`

---

## CRUD sản phẩm (Admin) – Hướng dẫn nhanh

1. Mở Admin → “Quản lý sản phẩm”
2. Nhấn **Thêm mới**
3. Điền:
   - Tên (không trống)
   - Giá (> 0)
   - Danh mục (bắt buộc)
   - Mô tả (không trống)
   - Upload ảnh (JPG/PNG/WEBP, max 2MB)
4. Lưu sản phẩm
5. Bấm **Xóa** → xác nhận bằng SweetAlert2

---

## Responsive guide

- Layout sử dụng:
  - Bootstrap 5 grid/flex
  - Product grid tự đổi cột:
    - PC: 3 cột
    - Tablet: 2 cột
    - Mobile: 1 cột
- Sidebar:
  - Giữ ổn định, phù hợp màn hình vừa

---

## Ghi chú

- Admin hiện tại là CRUD demo (chưa có login/authentication).
- Trạng thái “out_of_stock” là demo UI; backend đang lọc theo `active`.
