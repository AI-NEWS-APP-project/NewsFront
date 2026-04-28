interface Window {
  Kakao: {
    init: (key: string) => void
    isInitialized: () => boolean
    Auth: {
      authorize(arg0: { redirectUri: string }): unknown
      login: (options: KakaoLoginOptions) => void
    }
  }
}

interface KakaoLoginOptions {
  success: (authObj: KakaoAuthObject) => void
  fail: (error: Error | string) => void
}

interface KakaoAuthObject {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  scope: string
}
