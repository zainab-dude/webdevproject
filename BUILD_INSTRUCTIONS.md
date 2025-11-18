# Building and Installing CapShala PWA

## Prerequisites

1. Node.js (v14 or higher) installed
2. npm or yarn package manager

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## Building for Production

1. **Create production build:**
   ```bash
   npm run build
   ```
   This creates an optimized build in the `build` folder.

2. **Test production build locally:**
   ```bash
   npx serve -s build
   ```
   Or use any static file server to serve the `build` folder.

## Installing as PWA

### Desktop (Chrome/Edge)

1. Open the app in Chrome or Edge browser
2. Look for the install icon in the address bar (or the install prompt)
3. Click "Install" to add to your desktop
4. The app will appear in your applications menu

### Mobile (Android)

1. Open the app in Chrome browser
2. Tap the menu (three dots) → "Add to Home screen" or "Install app"
3. Or wait for the install prompt to appear
4. The app icon will be added to your home screen

### Mobile (iOS - Safari)

1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Select "Add to Home Screen"
4. Customize the name if needed
5. Tap "Add"

## Deploying to Web

### Option 1: Netlify

1. Build the app: `npm run build`
2. Drag and drop the `build` folder to [Netlify](https://app.netlify.com/drop)
3. Your app will be live with HTTPS (required for PWA)

### Option 2: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Option 3: GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d build"
   ```
3. Run: `npm run deploy`

### Option 4: Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run: `firebase init hosting`
3. Build: `npm run build`
4. Deploy: `firebase deploy`

## Important Notes

- **HTTPS Required**: PWAs require HTTPS in production (except localhost)
- **Icons**: Make sure to add `icon-192.png` and `icon-512.png` to the `public` folder
- **Service Worker**: The service worker is automatically registered
- **Manifest**: The manifest.json is configured for installability

## Testing PWA Features

1. Open Chrome DevTools (F12)
2. Go to "Application" tab
3. Check:
   - Service Workers (should be registered)
   - Manifest (should show app details)
   - Storage (localStorage for favorites)

## Troubleshooting

- **Install prompt not showing**: Make sure you're using HTTPS or localhost
- **Icons not showing**: Check that icon files exist in `public` folder
- **Service worker not working**: Check browser console for errors
- **App not installing**: Ensure manifest.json is valid and accessible

