import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // 개발 중 프론트(5173) → 게이트웨이(8080) 호출 시 CORS 를 피하기 위한 프록시.
  // 프론트는 항상 same-origin `/api/...` 로 호출하고, dev 서버가 게이트웨이로 포워딩한다.
  const gateway = env.VITE_GATEWAY_URL || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      host: true, // 같은 와이파이의 휴대폰에서 접속해 PWA 테스트 가능
      port: 5173,
      proxy: {
        '/api': {
          target: gateway,
          changeOrigin: true,
        },
      },
    },
  }
})
