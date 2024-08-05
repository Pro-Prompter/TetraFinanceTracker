import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000
  },
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),
    }
  }
});