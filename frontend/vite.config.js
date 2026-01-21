import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ordering-platform/', // add this line
  plugins: [react()]
});
