import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-[#1a2332] py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6 flex flex-col items-start">
          <p className="mb-2 text-lg font-bold text-white">BRIEFY</p>
          <p className="text-sm text-white/60">AI 기반 뉴스 큐레이션 서비스</p>
        </div>
        <div className="flex flex-col gap-2 border-t border-[#2C3E50] pt-6 text-sm text-white/50 sm:flex-row sm:justify-between">
          <p>© 2026 BRIEFY</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-[#6B9AC4]">
              개인정보처리방침
            </Link>
            <Link to="/terms" className="hover:text-[#6B9AC4]">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
