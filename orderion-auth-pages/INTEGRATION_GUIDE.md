# Integration Guide

## Quick Start

### Step 1: Copy Files

Copy these files from the `src/pages/` folder to your project:
- `Login.jsx` → `frontend/src/pages/Login.jsx`
- `Signup.jsx` → `frontend/src/pages/Signup.jsx`
- `Auth.css` → `frontend/src/pages/Auth.css`

### Step 2: Update App.jsx

**Add imports** (around line 12-13):
```javascript
import Login from './pages/Login';
import Signup from './pages/Signup';
```

**Update AppContent function** to conditionally hide Navbar:
```javascript
function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app">
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? 'auth-main' : ''}>
        <Routes>
          {/* ... existing routes ... */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  );
}
```

**Add useLocation import** at the top:
```javascript
import { Routes, Route, useLocation } from 'react-router-dom';
```

### Step 3: Update App.css

Add this to your `App.css`:
```css
main.auth-main {
  padding-top: 0;
}

@media (min-width: 768px) {
  main.auth-main {
    padding-top: 0;
  }
}
```

## Backend Integration

### Login Handler
**Location**: `frontend/src/pages/Login.jsx` (line 10-16)

Replace the placeholder with your API call:
```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/auth/login', { email, password });
    // Handle success (e.g., save token, redirect)
    navigate('/dashboard');
  } catch (error) {
    // Handle error (e.g., show error message)
    console.error('Login failed:', error);
  }
};
```

### Sign Up Handler
**Location**: `frontend/src/pages/Signup.jsx` (line 11-17)

Replace the placeholder with your API call:
```javascript
const handleSignup = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/auth/signup', { 
      email, 
      password, 
      phone 
    });
    // Handle success (e.g., redirect to login or auto-login)
    navigate('/login');
  } catch (error) {
    // Handle error (e.g., show error message)
    console.error('Signup failed:', error);
  }
};
```

## Routes

After integration, access:
- Login: `http://localhost:5173/#/login`
- Sign Up: `http://localhost:5173/#/signup`

Note: If using HashRouter (as your project does), routes include `#`.

## Testing

1. Navigate to `/login` - should show login page without navbar
2. Click "Sign Up" link - should navigate to `/signup`
3. Click "Back to login" - should navigate back to `/login`
4. Fill forms and submit - check console for placeholder logs
5. Social login buttons - should log to console (UI only)

## Customization

### Colors
Edit CSS variables in `Auth.css`:
```css
:root {
  --auth-primary: #008080; /* Change primary color */
  --auth-bg: #E0F2F1; /* Change background */
  /* ... */
}
```

### Styling
All styles are in `Auth.css`. Modify classes to match your brand:
- `.auth-header` - Top header section
- `.auth-card` - Main form card
- `.auth-input` - Input fields
- `.auth-submit-btn` - Submit buttons
