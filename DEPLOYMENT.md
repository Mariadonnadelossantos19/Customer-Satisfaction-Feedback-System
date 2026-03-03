# Deploy Customer Satisfaction Feedback System to Hostinger

**Your site URL:** https://mintcream-termite-167038.hostingersite.com/

---

## Use this method: Both on Hostinger (frontend + backend)

Same approach as PMNS: frontend and backend on Hostinger, database on MongoDB Atlas.

| Step | What to do |
|------|------------|
| 1 | **MongoDB Atlas** – Create free cluster, get connection string, add `0.0.0.0/0` in Network Access. |
| 2 | **Backend** – In hPanel → Node.js → Create app → Upload `backend` folder → Set env vars (MONGO_URI, JWT_SECRET, FRONTEND_URL, PORT) → Start command: `npm start` → Note backend URL. |
| 3 | **Frontend build** – On your PC: `cd frontend`, then `$env:VITE_API_URL="<BACKEND_URL>"; npm run build` (use the URL from step 2). |
| 4 | **Frontend upload** – File Manager → `public_html` → Upload all contents of `frontend/dist`. |
| 5 | **Test** – Open https://mintcream-termite-167038.hostingersite.com/ and try login (superadmin / admin123). |

Details for each step are below.

---

## Deploy both on Hostinger (detailed steps)

Use the same approach as your PMNS project: **frontend** and **backend** both on Hostinger.

### 1. Database (MongoDB Atlas – free)

- Go to [MongoDB Atlas](https://www.mongodb.com/atlas) → create free cluster → Database Access (create user) → Network Access (add `0.0.0.0/0` to allow Hostinger).
- Get the connection string: **Connect** → **Drivers** → copy URI (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`).

### 2. Backend on Hostinger (Node.js app)

- In **Hostinger hPanel** → **Advanced** → **Node.js** (or **Application** / **Setup Node.js App**).
- Create a new Node.js application:
  - **Node version:** 18 or 20.
  - **Application root:** e.g. `feedback-api` or `backend` (the folder where you will upload backend files).
  - **Application URL:** note the URL Hostinger gives (e.g. `https://mintcream-termite-167038.hostingersite.com:3000` or a path like `/api`).
- Upload your **backend** folder contents into that application root (on the server: `domains/.../feedback-api/` or similar): all files from your project’s `backend` folder (`server.js`, `package.json`, `config/`, `controllers/`, `models/`, `routes/`, `middleware/`, `constants/`).
- In the Node.js app settings, set **Environment variables**:
  - `MONGO_URI` = your Atlas connection string  
  - `JWT_SECRET` = long random string  
  - `FRONTEND_URL` = `https://mintcream-termite-167038.hostingersite.com`  
  - `PORT` = the port Hostinger assigns (often shown in the panel, e.g. 3000).
- **Start command:** `npm start` (or `node server.js`).  
- Run **Install dependencies** (or `npm install`) in that app folder, then **Start** / **Restart** the app.
- Copy the **backend URL** (e.g. `https://mintcream-termite-167038.hostingersite.com:3000` or the URL with the path Hostinger shows).

### 3. Build frontend with backend URL

On your computer:

```bash
cd frontend
npm install
# Replace with the actual backend URL from step 2 (no slash at the end)
# Windows PowerShell:
$env:VITE_API_URL="https://mintcream-termite-167038.hostingersite.com:3000"; npm run build
# Mac/Linux:
VITE_API_URL=https://mintcream-termite-167038.hostingersite.com:3000 npm run build
```

(If Hostinger gives a path like `https://.../api`, use that: `VITE_API_URL=https://mintcream-termite-167038.hostingersite.com/api`.)

### 4. Upload frontend to Hostinger

- In **File Manager** go to **public_html** (for https://mintcream-termite-167038.hostingersite.com/).
- Remove the default page if needed.
- Upload **all contents** of `frontend/dist`: `index.html`, `assets/` folder, `.htaccess` (the build already includes it from `frontend/public/.htaccess`).

### 5. CORS on backend

Backend already uses `FRONTEND_URL` for CORS. Ensure in the Node.js app you set:

`FRONTEND_URL=https://mintcream-termite-167038.hostingersite.com`

(no trailing slash).

### 6. Test

- Open **https://mintcream-termite-167038.hostingersite.com/** — you should see the app.
- Try **Admin login** (e.g. superadmin / admin123) and feedback flow; they will call the backend URL you set in `VITE_API_URL`.

---

## Alternative: Frontend on Hostinger, backend on Render

If your Hostinger plan has **no Node.js** support, host only the frontend on Hostinger and the backend on [Render](https://render.com):

1. **Frontend** → Hostinger (https://mintcream-termite-167038.hostingersite.com/)
2. **Backend** → Render (free)
3. **Database** → MongoDB Atlas (free)

### Step-by-step (backend on Render)

**1. Deploy the backend first (Render)**  
- Go to [Render](https://render.com) → New → Web Service.  
- Connect your repo (or upload the `backend` folder). Set **Root Directory** to `backend`.  
- Build: `npm install`, Start: `npm start`.  
- In **Environment**, add:
  - `MONGO_URI` = your MongoDB Atlas connection string  
  - `JWT_SECRET` = a long random string  
  - `FRONTEND_URL` = `https://mintcream-termite-167038.hostingersite.com`  
- Deploy and copy the backend URL (e.g. `https://your-app-name.onrender.com`).

**2. Build the frontend with that API URL**  
On your computer, in the project folder:

```bash
cd frontend
npm install
# Windows PowerShell:
$env:VITE_API_URL="https://your-app-name.onrender.com"; npm run build
# Mac/Linux:
VITE_API_URL=https://your-app-name.onrender.com npm run build
```

**3. Upload to Hostinger**  
- In Hostinger: **File Manager** → `public_html` (or the folder for this site).  
- Delete the default `index.html` if present.  
- Upload **all contents** of `frontend/dist` (the files inside `dist`, not the `dist` folder itself):  
  `index.html`, `assets/` folder, etc., into `public_html`.  
- Add a file `public_html/.htaccess` with this content (so React Router works):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**4. Open your site**  
Visit **https://mintcream-termite-167038.hostingersite.com/** — you should see the app. Admin login and API will use the Render backend URL automatically.

---

## Option 1: Hostinger VPS (if you have or will get VPS)

You can run both backend and frontend on one Hostinger VPS.

### 1. Get a Hostinger VPS and connect via SSH

- Buy a VPS (e.g. KVM 1).
- Note the server IP and SSH credentials from the panel.

### 2. Install on the server

```bash
# Install Node.js 18+ (example for Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (or use MongoDB Atlas - see below)
# Optional: use MongoDB Atlas free cluster instead of installing MongoDB
```

### 3. Use MongoDB Atlas (recommended, free tier)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas), create an account, create a free cluster.
2. Create a database user and get the connection string.
3. In Network Access, add your VPS IP (or `0.0.0.0/0` for testing).
4. Copy the URI, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`.

### 4. Upload your project and run backend

On your computer (from project root):

```bash
# Build frontend first (so you can serve it from backend or Nginx)
cd frontend
npm ci
npm run build
cd ..
```

Upload the whole project to the VPS (e.g. with FileZilla/SCP or Git clone on the server).

On the **VPS**:

```bash
cd /path/to/your/project/backend
npm ci --omit=dev
```

Create `backend/.env` on the server:

```env
MONGO_URI=mongodb+srv://youruser:yourpass@cluster.xxx.mongodb.net/customer_feedback_db?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-long-random-secret-key-here
FRONTEND_URL=https://yourdomain.com
```

Start the backend (use PM2 so it keeps running):

```bash
sudo npm install -g pm2
cd /path/to/your/project/backend
pm2 start server.js --name "feedback-api"
pm2 save
pm2 startup
```

### 5. Serve frontend and proxy API (Nginx)

Install Nginx:

```bash
sudo apt install nginx
```

Create a site config (e.g. `/etc/nginx/sites-available/feedback`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /path/to/your/project/frontend/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/feedback /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Build frontend with production API URL

On your **computer** (or on the server after cloning), set the API URL and build:

```bash
cd frontend
# Windows (PowerShell):
$env:VITE_API_URL="https://yourdomain.com"; npm run build
# Linux/Mac:
VITE_API_URL=https://yourdomain.com npm run build
```

Then upload the updated `frontend/dist` to the VPS (or run the build on the server).

### 7. HTTPS (optional but recommended)

Use Hostinger’s SSL or Let’s Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Point your domain’s A record in Hostinger DNS to your VPS IP.

---

## Option 2: Hostinger shared hosting (frontend only) + free backend host

If you only have **shared hosting** (no Node.js), host the **frontend** on Hostinger and the **backend** elsewhere.

### 1. Backend and database

- **Database:** Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas). Get the connection string.
- **Backend:** Deploy the `backend` folder to a free Node.js host, e.g.:
  - [Render](https://render.com) – New Web Service, connect repo, root: `backend`, build: `npm install`, start: `npm start`. Add env: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL=https://yourdomain.com`.
  - [Railway](https://railway.app) – similar: deploy `backend`, set env vars.

You’ll get a URL like `https://your-api.onrender.com`.

### 2. Build frontend with that API URL

On your computer:

```bash
cd frontend
# Set the API URL to your deployed backend
# Windows PowerShell:
$env:VITE_API_URL="https://your-api.onrender.com"; npm run build
# Linux/Mac:
VITE_API_URL=https://your-api.onrender.com npm run build
```

### 3. Upload frontend to Hostinger

- In Hostinger File Manager (or FTP), go to `public_html` (or the folder for your domain).
- Upload **all contents** of `frontend/dist` (not the `dist` folder itself) into that folder.
- Ensure there is an `index.html` at the root.

### 4. Backend CORS

On the backend (Render/Railway), set:

```env
FRONTEND_URL=https://yourdomain.com
```

So the backend allows requests from your Hostinger site.

---

## Environment variables summary

### Backend (`.env` or host’s env)

| Variable       | Description |
|----------------|-------------|
| `MONGO_URI`    | MongoDB connection string (e.g. from Atlas). |
| `PORT`         | Server port (e.g. `5000`). Hosts like Render set this automatically. |
| `JWT_SECRET`   | Long random string for signing tokens. |
| `FRONTEND_URL` | Full URL of your frontend (e.g. `https://yourdomain.com`) for CORS. |

### Frontend (build-time)

| Variable        | Description |
|-----------------|-------------|
| `VITE_API_URL`  | Full URL of your API (e.g. `https://your-api.onrender.com` or `https://yourdomain.com` when using Nginx proxy). |

Build with that variable set so the built app calls the right API.

---

## Quick checklist

- [ ] MongoDB Atlas cluster created and connection string in `MONGO_URI`.
- [ ] Backend env: `JWT_SECRET`, `FRONTEND_URL` (and `PORT` if needed).
- [ ] Frontend built with `VITE_API_URL` set to your API URL.
- [ ] Backend deployed and reachable (VPS + PM2 or Render/Railway).
- [ ] Frontend files uploaded to Hostinger (Option 2) or served from VPS (Option 1).
- [ ] Domain points to the right server (VPS IP or shared hosting).
- [ ] HTTPS enabled and links use `https://`.

If you tell me whether you have **VPS** or **shared hosting** on Hostinger, I can give step-by-step commands tailored to that.
