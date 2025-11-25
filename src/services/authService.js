// Simple authentication service using localStorage (JSON-based)
// Users are stored in localStorage as JSON

const USERS_STORAGE_KEY = 'capshala-users';
const CURRENT_USER_KEY = 'capshala-current-user';

// Get all users from localStorage
const getUsers = () => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : {};
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Get current logged-in user
export const getCurrentUser = () => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!userJson) return null;
  
  const user = JSON.parse(userJson);
  
  // If user doesn't have createdAt, try to fetch it from users storage
  if (user && user.email && !user.createdAt) {
    const users = getUsers();
    const fullUserData = users[user.email.toLowerCase()];
    if (fullUserData && fullUserData.createdAt) {
      user.createdAt = fullUserData.createdAt;
      setCurrentUser(user); // Update stored user with createdAt
    }
  }
  
  return user;
};

// Set current logged-in user
const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Sign up a new user
export const signUp = async (email, password, fullName) => {
  const users = getUsers();
  
  // Check if user already exists
  if (users[email]) {
    throw new Error('This email is already registered. Please log in instead.');
  }

  // Validate password
  if (password.length < 6) {
    throw new Error('Password should be at least 6 characters.');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email address.');
  }

  // Create new user
  const userId = Date.now().toString(); // Simple ID generation
  const newUser = {
    uid: userId,
    email: email.toLowerCase().trim(),
    displayName: fullName.trim(),
    password: password, // In a real app, this should be hashed!
    createdAt: new Date().toISOString()
  };

  // Save user
  users[email.toLowerCase().trim()] = newUser;
  saveUsers(users);

  // Auto-login after signup
  const userToReturn = {
    uid: newUser.uid,
    email: newUser.email,
    displayName: newUser.displayName,
    createdAt: newUser.createdAt
  };
  setCurrentUser(userToReturn);

  return userToReturn;
};

// Sign in an existing user
export const signIn = async (email, password) => {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const user = users[normalizedEmail];

  if (!user) {
    throw new Error('No account found with this email. Please sign up.');
  }

  if (user.password !== password) {
    throw new Error('Incorrect password. Please try again.');
  }

  // Set current user
  const userToReturn = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt
  };
  setCurrentUser(userToReturn);

  return userToReturn;
};

// Sign out current user
export const signOut = () => {
  setCurrentUser(null);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Listen to auth state changes (simulated with events)
let authStateListeners = [];

export const onAuthStateChanged = (callback) => {
  authStateListeners.push(callback);
  
  // Immediately call with current state
  callback(getCurrentUser());

  // Return unsubscribe function
  return () => {
    authStateListeners = authStateListeners.filter(listener => listener !== callback);
  };
};

// Notify all listeners of auth state change
const notifyAuthStateChange = (user) => {
  authStateListeners.forEach(listener => listener(user));
};

// Sign out with notification
export const signOutWithNotification = () => {
  setCurrentUser(null);
  notifyAuthStateChange(null);
};

// Sign in with notification
export const signInWithNotification = async (email, password) => {
  const user = await signIn(email, password);
  notifyAuthStateChange(user);
  return user;
};

// Sign up with notification
export const signUpWithNotification = async (email, password, fullName) => {
  const user = await signUp(email, password, fullName);
  notifyAuthStateChange(user);
  return user;
};

