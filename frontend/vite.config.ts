import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // запросы /api в dev-режиме уходят на ASP.NET бэкенд (профиль http из launchSettings.json)
    proxy: {
      '/api': 'http://localhost:5226',
    },
  },
})
