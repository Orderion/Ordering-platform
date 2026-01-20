# Frontend

React application built with Vite for static export to GitHub Pages.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and set your API URL:
```
VITE_API_URL=http://localhost:3000
VITE_ADMIN_GITHUB_ID=your_github_user_id
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable components
├── contexts/       # React contexts (Auth)
├── pages/          # Page components
├── services/       # API service layer
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Deployment

See `../DEPLOYMENT.md` for GitHub Pages deployment instructions.
