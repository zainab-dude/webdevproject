# Firebase Authentication Setup Guide

This app now uses Firebase Authentication for secure user authentication with email/password and Google sign-in options.

## 🔥 Firebase Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

### 2. Enable Authentication Methods

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: 
     - Click "Email/Password"
     - Toggle "Enable" 
     - Click **Save**
   
   - **Google**: 
     - Click "Google"
     - Toggle "Enable"
     - Enter a support email (your email address)
     - Click **Save**

### 3. Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "CapShala Web")
5. Copy the Firebase configuration object

### 4. Configure Environment Variables

Create a `.env` file in the root of your project:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

**OR** directly edit `src/config/firebase.js` and replace the placeholder values with your Firebase config.

### 5. Add Authorized Domains (for OAuth)

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add your development domain (e.g., `localhost`) if not already present
3. Add your production domain when deploying

## ✅ Features

- ✅ **Email/Password Authentication**: Users can sign up and log in with email and password
- ✅ **Google Sign-In**: One-click sign-in with Google account
- ✅ **Automatic Session Management**: Firebase handles session persistence automatically
- ✅ **Secure**: Passwords are hashed and stored securely by Firebase
- ✅ **Cross-Device**: User sessions work across devices (when using same Firebase project)

## 🔒 Security Notes

- Passwords are securely hashed by Firebase (not stored in plain text)
- Firebase handles all authentication security best practices
- Session tokens are managed automatically
- OAuth providers (Google) handle their own security

## 🚀 Testing

1. Start your app: `npm start`
2. Try signing up with email/password
3. Try signing in with Google
4. Check that you stay logged in after page refresh (session persistence)

## 📝 Important Notes

- **OAuth Redirect URIs**: Make sure to add your domain to authorized domains in Firebase
- **Environment Variables**: Never commit your `.env` file to version control
- **Production**: Update authorized domains when deploying to production

## 🐛 Troubleshooting

### "Firebase: Error (auth/popup-blocked)"
- Your browser is blocking popups. Allow popups for your domain and try again.

### "Firebase: Error (auth/popup-closed-by-user)"
- User closed the sign-in popup. This is normal if the user cancels.

### "Firebase: Error (auth/unauthorized-domain)"
- Add your domain to authorized domains in Firebase Console > Authentication > Settings

### Google sign-in not working
- Make sure Google provider is enabled in Firebase Console
- Check that your OAuth redirect URIs are configured correctly
- Ensure your domain is added to authorized domains in Firebase

## 📚 Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Web Setup Guide](https://firebase.google.com/docs/web/setup)
- [Google Sign-In Setup](https://firebase.google.com/docs/auth/web/google-signin)

