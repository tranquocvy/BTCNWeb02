# BTCNWeb02 - Hướng dẫn nhanh

Hướng dẫn ngắn để cấu hình và chạy project này cục bộ.

**Yêu cầu**

- Node.js và npm đã cài đặt trên máy.

**Cấu hình môi trường**

- Sao chép file `.env.example` và chỉ điền `VITE_API_TOKEN` vào file mới:

```bash
cp .env.example .env.local    # macOS / Linux
Copy-Item .env.example .env.local -Force    # PowerShell (Windows)
```

- Mở ` .env.local` và thay giá trị `VITE_API_TOKEN` bằng token thực của bạn. Ví dụ:

```
VITE_API_TOKEN=your_real_token_here
```

**Cài đặt & Chạy**

```bash
npm i
npm start    # chạy Vite (dev server)
```
