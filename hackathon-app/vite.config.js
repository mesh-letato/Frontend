import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // 같은 와이파이의 휴대폰에서 접속해 PWA 테스트 가능
    port: 5173,
  },
})
