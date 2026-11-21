# Finance Tracker (MERN, JavaScript)

No login. Add income/expenses, mark rent-style items as "repeats monthly", and compare months with charts. Light/dark toggle included.

## Run
Needs Node 18+ and MongoDB (local, or an Atlas URI).

```bash
# terminal 1
cd server && npm install && cp .env.example .env && npm run dev
# terminal 2
cd client && npm install && npm run dev
```
Open http://localhost:5173 (the Vite dev server proxies /api to port 5000).
