import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server:{port: 5174}, 
  preview: {
    allowedHosts: ['doctor-appointment-booking-system-8.onrender.com'],
    host: '0.0.0.0',
    port: process.env.PORT || 5174,
  }
})
