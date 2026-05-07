import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AppProviders } from '@app/providers/AppProviders'
import { router } from '@app/router'

function App() {
  useEffect(() => {
    const KAKAO_KEY = import.meta.env.VITE_KAKAO_JS_KEY
    const initKakao = () => {
      if (window.Kakao && KAKAO_KEY && !window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_KEY)
        console.log('Kakao initialized:', window.Kakao.isInitialized())
      }
    }

    if (window.Kakao) {
      initKakao()
    } else {
      const script = document.querySelector(`script[src*="kakaocdn.net"]`)
      script?.addEventListener('load', initKakao)
    }
  }, [])

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}

export default App
