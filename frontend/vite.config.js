import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace "your-repo-name" with the actual repo name (case sensitive)
export default defineConfig({
  base: '/ordering-platform/', 
  plugins: [react()],
});
