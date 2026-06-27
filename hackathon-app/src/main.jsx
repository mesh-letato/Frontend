import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// PWA: 서비스 워커 등록 (프로덕션 빌드에서만)
// 개발 모드에서는 SW 의 cache-first 전략이 Vite 모듈/HMR 요청을 가로채
// 흰 화면을 유발하므로 등록하지 않고, 이미 설치된 SW 가 있으면 해제한다.
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    })
  } else {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister())
    })
    if (window.caches) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
    }
  }
}
