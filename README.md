# Creator Campaign Mini App

Telegram Mini App untuk campaign creator dengan sistem point tracking.

## Setup Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`

## Deploy ke Vercel

1. Push repo ke GitHub
2. Di Vercel, connect GitHub repo
3. Environment variables:
   - `NEXT_PUBLIC_API_URL`: http://YOUR_VPS_IP:5000
4. Deploy

## Setup di Telegram Bot

Di BotFather, set Mini App URL:
```
/mybots > Select bot > Bot Settings > Menu Button > Web App > Set URL
```

URL: `https://your-vercel-domain.vercel.app`

## Backend API

Backend running di `http://YOUR_VPS_IP:5000`

Endpoints:
- POST `/api/auth/login`
- GET `/api/creators/:telegram_id`
- PUT `/api/creators/:telegram_id`
- POST `/api/submissions`
- GET `/api/submissions/:telegram_id`
- GET `/api/leaderboard`
- GET `/api/admin/check/:telegram_id`
- GET `/api/admin/submissions/pending`
- POST `/api/admin/submissions/:id/approve`
- POST `/api/admin/submissions/:id/reject`
