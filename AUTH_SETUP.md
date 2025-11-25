# Authentication Setup (JSON-based)

This app uses a simple JSON-based authentication system that stores user data in the browser's localStorage.

## How It Works

- **User Data Storage**: All user accounts are stored in localStorage as JSON
- **No Backend Required**: Everything runs client-side
- **Simple & Fast**: No external API calls or database setup needed
- **Works Offline**: Authentication works completely offline

## Storage Keys

The app uses two localStorage keys:
- `capshala-users`: Stores all registered user accounts (JSON object)
- `capshala-current-user`: Stores the currently logged-in user (JSON object)

## Features

✅ Sign up with email, password, and full name  
✅ Login with email and password  
✅ User session persistence (stays logged in after page refresh)  
✅ Protected routes (redirects to login if not authenticated)  
✅ Logout functionality  

## Security Note

⚠️ **Important**: This is a simple client-side authentication system suitable for:
- Development/testing
- Personal projects
- Prototypes
- Apps that don't require high security

**Not suitable for**:
- Production apps with sensitive data
- Apps requiring real security
- Multi-user systems where data needs to be shared

For production apps, consider:
- Password hashing (bcrypt)
- Server-side authentication
- JWT tokens
- OAuth providers (Google, Facebook, etc.)
- Firebase Authentication or similar services

## Usage

1. **Sign Up**: Users can create an account on the signup page
2. **Login**: Users can log in with their email and password
3. **Session**: Users stay logged in until they log out or clear browser data
4. **Protected Routes**: All main app routes require authentication

## Testing

1. Start the app: `npm start`
2. Navigate to the signup page
3. Create a test account
4. You'll be automatically logged in and redirected to categories
5. Refresh the page - you'll stay logged in
6. Log out and log back in to test the login flow

## Data Location

You can view stored user data in browser DevTools:
1. Open DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Expand Local Storage
4. Look for `capshala-users` and `capshala-current-user`

