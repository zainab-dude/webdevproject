# CapShala - Progressive Web App (PWA)

A modern, installable React Progressive Web App for browsing captions in Urdu, Roman, and English. Works seamlessly on both desktop and mobile devices.

## Features

- 🎨 Beautiful UI with fully responsive design
- 📱 Mobile-friendly navigation with bottom nav bar
- 💻 Desktop-optimized layout with sidebar
- 📲 **Installable PWA** - Add to home screen/desktop
- ❤️ Favorites system with local storage persistence
- 🔍 Category filtering
- 📋 Copy and share functionality
- 🎯 Multiple language support (Urdu, Roman, English)
- 🔄 Offline support with service worker
- 📱 Touch-optimized for mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Add app icons** (required for PWA):
   - Create `icon-192.png` (192x192px) and `icon-512.png` (512x512px)
   - Place them in the `public` folder
   - See `public/icon-placeholder.md` for details

3. **Start the development server:**
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Installing as an App

### Desktop (Chrome/Edge)
- Look for the install icon in the address bar
- Or use the install prompt that appears
- The app will be added to your applications

### Mobile (Android)
- Open in Chrome browser
- Tap menu → "Add to Home screen" or "Install app"
- Or use the install prompt

### Mobile (iOS - Safari)
- Open in Safari
- Tap Share button → "Add to Home Screen"
- Customize name and tap "Add"

## Building for Production

1. **Create production build:**
```bash
npm run build
```

2. **Test production build:**
```bash
npx serve -s build
```

3. **Deploy** to any static hosting (Netlify, Vercel, Firebase, etc.)
   - See `BUILD_INSTRUCTIONS.md` for detailed deployment guides

## Project Structure

```
src/
├── components/          # React components
│   ├── SplashScreen.js
│   ├── Login.js
│   ├── Signup.js
│   ├── CategorySelection.js
│   ├── Homepage.js
│   ├── Favorites.js
│   ├── Navbar.js
│   ├── CaptionCard.js
│   └── InstallPrompt.js
├── context/            # Context API for state management
│   └── AppContext.js
├── App.js              # Main app component with routing
├── index.js            # Entry point
└── serviceWorkerRegistration.js
public/
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── index.html
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## Responsive Design

- **Desktop (>1024px)**: Full layout with sidebar and desktop navigation
- **Tablet (769-1024px)**: Optimized layout with adjusted spacing
- **Mobile (<768px)**: Mobile-first design with bottom navigation
- **Small Mobile (<480px)**: Compact layout for small screens

## PWA Features

- ✅ Web App Manifest
- ✅ Service Worker (offline support)
- ✅ Install prompt
- ✅ Responsive design
- ✅ Touch-optimized interactions
- ✅ App-like experience

## Technologies Used

- React 18
- React Router DOM
- Font Awesome Icons
- Google Fonts (Inter)
- Progressive Web App (PWA) technologies

## License

This project is for educational purposes.

## Need Help?

See `BUILD_INSTRUCTIONS.md` for detailed deployment and installation instructions.

