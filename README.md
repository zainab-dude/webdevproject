## CaptionVibes – Caption Generator App

Modern MERN-style app for browsing and creating social‑media captions with language filters and a MongoDB backend.

### 1. Tech Stack

- **Frontend**: React (Vite), React Router, Tailwind-like styling, Phosphor Icons  
- **Backend**: Node.js, Express, Mongoose  
- **Database**: MongoDB (local or Atlas via connection string)  
- **Dev tools**: ESLint, Vite dev server

Project layout:

- `client/` – React SPA
- `server/` – Express + MongoDB API

---

### 2. Prerequisites

- Node.js 18+ (you are using v22)  
- npm  
- MongoDB:
  - **EITHER** local MongoDB running on `mongodb://127.0.0.1:27017`
  - **OR** MongoDB Atlas cluster with a connection string

---

### 3. Backend (server) – Setup & Run

Path: `D:\sem5\AI\KIllme\caption\server`

#### 3.1 Install dependencies (once)

```bash
cd caption/server
npm install
```

#### 3.2 Environment variables

Create a `.env` file in `server`:

```env
MONGO_URI=<your-mongodb-uri>
PORT=5000
```

Examples:

- **Local Mongo**:

```env
MONGO_URI=mongodb://127.0.0.1:27017/caption_vibes
```

- **Atlas** (replace placeholders with your values):

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/caption_vibes?retryWrites=true&w=majority&appName=<app-name>
```

Make sure in Atlas:
- Your **IP is allowed** in Network Access.
- The **user & password** match what you put in `MONGO_URI`.

#### 3.3 Start the API server

```bash
cd caption/server
npm start
```

Expected console output:

- `Server running on port 5000`
- `MongoDB Connected`

#### 3.4 API Endpoints

- `GET /api/captions?lang=english|urdu|roman`  
  Returns captions filtered by language (default `english`).

- `POST /api/captions`

```json
{
  "text": "Your caption here",
  "language": "english",
  "category": "General"
}
```

Server logic lives in:
- `server/index.js` – Express app, routes, Mongo connection
- `server/models/Caption.js` – caption schema (text, language, category, likes, gradient, createdAt)
- `server/utils.js` – `getRandomGradient()` helper

---

### 4. Frontend (client) – Setup & Run

Path: `D:\sem5\AI\KIllme\caption\client`

#### 4.1 Install dependencies (once)

```bash
cd caption/client
npm install
```

This installs:
- React + ReactDOM
- `react-router-dom`
- Tailwind / PostCSS tooling
- `@phosphor-icons/react`

#### 4.2 Run the dev server

```bash
cd caption/client
npm run dev
```

Vite will show something like:

- `Local:   http://localhost:5173/`

Open that URL in your browser.

#### 4.3 Build for production

```bash
cd caption/client
npm run build
```

Output goes to `client/dist/` (static HTML/CSS/JS files).

---

### 5. How the Frontend Works

Key files:

- `src/App.jsx`
  - Wraps the app in `BrowserRouter`.
  - Holds:
    - `selectedLang` state (`english | urdu | roman`)
    - `user` mock auth state (null or a fake user object)
    - `toastVisible` for “Copied” toast.
  - Routes:
    - `/` → `Feed` (caption listing)
    - `/upload` → `Upload` (create new caption form)
    - `/favorites` → placeholder favorites view

- `src/components/Sidebar.jsx`
  - Left side navigation:
    - **Search bar** (visual only at the moment; not wired to backend)
    - **Links**:
      - `Home` → `/`
      - `Favorites` → `/favorites`
    - **Language selector**:
      - Buttons for English, Urdu, Roman
      - Calls `setLang` from `App` to change `selectedLang`.
    - **Auth section**:
      - If `user` is null → shows **Login / Sign Up** button (`onLogin` mock).
      - If `user` is set → shows avatar, name, username, and a Logout icon (`onLogout`).

- `src/components/Feed.jsx`
  - Fetches captions from:

```js
fetch(`http://localhost:5000/api/captions?lang=${selectedLang}`)
```

  - Shows **“Loading vibes…”** while fetching.
  - Renders a masonry-like list of `CaptionCard` components on success.

- `src/components/CaptionCard.jsx`
  - Displays a single caption:
    - Text
    - Tag / category
    - Likes
    - Gradient background from the `gradient` field.
  - Has a **Copy** button that triggers `onCopy`, which:
    - Copies text to clipboard.
    - Shows toast “Copied to clipboard!”.

- `src/pages/Upload.jsx`
  - Form for creating a caption:
    - Language selector (English / Urdu / Roman).
    - Textarea with dynamic placeholder and RTL support for Urdu.
    - Category / tag input.
  - On submit:

```js
POST http://localhost:5000/api/captions
```

  - On success, redirects back to `/`.

- `src/components/Toast.jsx`
  - Small bottom‑center toast shown when a caption is copied.

---

### 6. Auth / Login Behavior (Current)

Right now, authentication is **mocked on the frontend only**:

- `App.jsx`:
  - `user` state starts as `null`.
  - `handleLogin()` sets a fake user object (name, username, avatar).
  - `handleLogout()` sets `user` back to `null`.

- `Sidebar.jsx`:
  - When logged out:
    - Shows a **“Login / Sign Up”** gradient button that calls `onLogin`.
  - When logged in:
    - Shows:
      - Avatar + display name + username.
      - A logout button that calls `onLogout`.

There is **no backend auth** yet (no JWT, no sessions, no Google OAuth).  
The “Continue with Google” UX you asked for can be added later using something like Google Identity Services or Firebase Auth.

---

### 7. Common Issues & Fixes

- **Blank screen on frontend**
  - Check browser dev tools → **Console** for any red error.
  - Typical causes:
    - Missing imports (e.g. forgot to import an icon from `@phosphor-icons/react`).
    - Backend not running → fetch errors (the UI now stops showing “Loading” even on error).

- **`Cannot find module './models/Caption'` in server**
  - Ensure file exists at: `server/models/Caption.js`  
  - Exported as:

```js
module.exports = mongoose.model('Caption', CaptionSchema);
```

- **`MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`**
  - Means MongoDB at `127.0.0.1:27017` isn’t running or URI is wrong.
  - If using Atlas, confirm `MONGO_URI` points to your cluster, not localhost.

---

### 8. Quick Start (TL;DR)

From `D:\sem5\AI\KIllme\caption`:

```bash
# 1) Backend
cd server
npm install          # first time only
npm start            # needs valid .env with MONGO_URI

# 2) Frontend (new terminal)
cd ../client
npm install          # first time only
npm run dev          # open the shown http://localhost:5173 URL
```

Then:
- Visit `http://localhost:5173/` for the app.
- API is at `http://localhost:5000/api/captions`.


