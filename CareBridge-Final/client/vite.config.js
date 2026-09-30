import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The proxy sends /api calls to the Express server, so the browser never hits CORS.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true, proxy: { '/api': 'http://localhost:5000' } }
});
