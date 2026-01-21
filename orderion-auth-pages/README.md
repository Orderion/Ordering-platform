# Orderion Auth Pages

Complete Login and Sign Up pages for the Orderion web app.

## Files Included

### Components
- `src/pages/Login.jsx` - Login page component
- `src/pages/Signup.jsx` - Sign Up page component
- `src/pages/Auth.css` - Shared stylesheet for auth pages

### App Integration
- `src/App.jsx` - Modified App.jsx with routes and conditional navbar
- `src/App.css` - Modified App.css with auth page styles

## Installation Instructions

1. Copy the files to your project:
   - `Login.jsx` → `frontend/src/pages/Login.jsx`
   - `Signup.jsx` → `frontend/src/pages/Signup.jsx`
   - `Auth.css` → `frontend/src/pages/Auth.css`

2. Update your `App.jsx`:
   - Add the imports for Login and Signup
   - Add the routes for `/login` and `/signup`
   - The file in this folder shows the complete updated version

3. Update your `App.css`:
   - Add the `.auth-main` class to remove padding on auth pages
   - The file in this folder shows the complete updated version

## Features

✅ Modern, mobile-first design
✅ Teal/Deep Green color palette
✅ Smooth hover and focus states
✅ Social login buttons (UI only)
✅ Controlled inputs with React hooks
✅ React Router navigation
✅ Placeholder handler functions ready for backend integration

## Routes

- `/login` - Login page
- `/signup` - Sign Up page

## Backend Integration

The handler functions are located at:
- **Login**: `Login.jsx` - `handleLogin` function (line 10-16)
- **Sign Up**: `Signup.jsx` - `handleSignup` function (line 11-17)

Replace the `console.log` statements with your API calls.

## Dependencies

Ensure you have these installed:
- react
- react-dom
- react-router-dom

These are standard React Router dependencies and should already be in your project.
