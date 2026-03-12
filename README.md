# Thư Viện Xuất Nhập Khẩu 🇻🇳

Website tra cứu văn bản pháp lý và HS Code xuất nhập khẩu Việt Nam.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** TailwindCSS
- **Database:** PostgreSQL + Prisma ORM
- **Import dữ liệu:** SheetJS (xlsx)

## Cài đặt

### 1. Clone repo & cài dependencies

```bash
git clone https://github.com/dungdaongocanh-wq/xuatnhapkhau.git
cd xuatnhapkhau
npm install
```

### 2. Cấu hình môi trường

```bash
cp .env.example .env
```

Sửa file `.env`, điền thông tin PostgreSQL của bạn:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/xuatnhapkhau"
```

### 3. Khởi tạo database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Chạy development server

```bash
npm run dev
```

Truy cập: http://localhost:3000

---

## Import dữ liệu HS Code từ file Excel

### Chuẩn bị file Excel

Đặt file Excel vào thư mục `data/`, đặt tên là `hs-code.xlsx`.

Cấu trúc cột Excel cần có:
| Cột Excel | Trường dữ liệu | Mô tả |
|-----------|---------------|-------|
| B | Mã hàng | HS Code (vd: 01022100) |
| C | Mô tả hàng hoá - Tiếng Việt | Tên hàng |
| D | Đơn vị tính | kg/con, kg, cái... |
| 1 | NK TT | Thuế nhập khẩu thông thường |
| 2 | NK Ưu đãi | Thuế nhập khẩu ưu đãi (MFN) |
| 3 | VAT | Thuế VAT |
| 4 | ACFTA | Thuế ASEAN-Trung Quốc |
| 5 | ATIGA | Thuế ASEAN |
| 6 | AiCEP | |
| 7 | VJEPA | Thuế Việt Nam - Nhật Bản |
| 8 | AKFTA | Thuế ASEAN - Hàn Quốc |
| 9 | AANZFTA | Thuế ASEAN - Úc/NZ |
| 10 | AIFTA | Thuế ASEAN - Ấn Độ |
| 11 | VKFTA | Thuế Việt Nam - Hàn Quốc |
| 12 | VCFTA | Thuế Việt Nam - Chile |
| 13 | VNEAEU | Thuế Việt Nam - EAEU |
| 14 | CPTPP | Thuế CPTPP |
| 15 | AHKFTA | Thuế ASEAN - Hồng Kông |
| 16 | VNCU | |
| 17 | EVFTA | Thuế Việt Nam - EU |
| 18 | UKVFTA | Thuế Việt Nam - Anh |
| 19 | VIFTA | Thuế Việt Nam - Israel |
| 27 | TT ĐB | Thuế tiêu thụ đặc biệt |
| 28 | XK | Thuế xuất khẩu |
| 29 | XK CP TPP | |
| 30 | XK EV | |
| 31 | XK UKV | |
| 32 | Thuế BV MT | Thuế bảo vệ môi trường |
| F | Chính sách mặt hàng | Theo mã HS |
| G | Giảm VAT | |

### Chạy script import

```bash
npx ts-node --esm scripts/import-excel.ts --file=./data/hs-code.xlsx
```

---

## Cấu trúc thư mục

```
xuatnhapkhau/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Trang chủ
│   ├── tra-cuu-van-ban/page.tsx    # Tra cứu văn bản pháp lý
│   ├── tra-cuu-hs-code/page.tsx    # Tra cứu HS Code
│   └── api/hs-code/route.ts        # API tìm kiếm
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── hs-code/
│       ├── HSCodeSearchBar.tsx
│       ├── HSCodeTable.tsx
│       └── HSCodeDetailModal.tsx
├── lib/prisma.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── scripts/
│   └── import-excel.ts
└── data/                           # Đặt file Excel vào đây
    └── .gitkeep
```

## Liên hệ & Đóng góp

Mọi góp ý xin liên hệ qua GitHub Issues.