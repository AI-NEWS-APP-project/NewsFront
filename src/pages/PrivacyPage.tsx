import Footer from '@shared/components/Footer'
import Header from '@shared/components/header'

const PRIVACY_SECTIONS = [
  {
    title: '수집하는 개인정보',
    items: [
      '회원가입 및 로그인 과정에서 이메일, 비밀번호, 이름을 수집합니다.',
      '맞춤 뉴스 제공을 위해 사용자가 등록한 관심 키워드와 알림 설정을 저장합니다.',
      '소셜 로그인 이용 시 인증 제공자로부터 전달받은 식별 정보와 이메일을 처리할 수 있습니다.',
    ],
  },
  {
    title: '개인정보 이용 목적',
    items: [
      '회원 식별, 로그인 유지, 계정 관리 등 서비스 제공에 사용합니다.',
      '관심 키워드 기반 뉴스 요약, 데일리 브리핑, 알림 기능 제공에 활용합니다.',
      '서비스 안정성 개선, 오류 대응, 부정 이용 방지를 위해 필요한 범위에서 이용합니다.',
    ],
  },
  {
    title: '보관 및 파기',
    items: [
      '개인정보는 서비스 이용 기간 동안 보관하며, 회원 탈퇴 또는 수집 목적 달성 시 지체 없이 파기합니다.',
      '관련 법령에 따라 보관이 필요한 정보는 정해진 기간 동안 분리하여 보관합니다.',
    ],
  },
  {
    title: '이용자의 권리',
    items: [
      '이용자는 언제든지 개인정보 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.',
      '알림 수신 여부와 관심 키워드는 설정 페이지에서 직접 변경할 수 있습니다.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FBFD] font-sans text-[#2C3E50]">
      <Header />
      <main className="mx-auto w-full max-w-4xl px-6 pt-24 pb-16 text-left">
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold text-[#7899C5]">BRIEFY Policy</p>
          <h1 className="mb-4 text-[34px] font-bold tracking-normal text-[#2C3E50]">
            개인정보처리방침
          </h1>
          <p className="text-[15px] leading-7 text-[#5A6A85]">
            BRIEFY는 사용자의 개인정보를 필요한 범위에서만 처리하며, 안전하게
            보호하기 위해 노력합니다.
          </p>
        </div>

        <section className="rounded-[24px] border border-[#D9E5F3] bg-white p-7 shadow-[0_10px_28px_rgba(73,98,128,0.08)]">
          <p className="mb-7 text-sm font-semibold text-[#7A92B5]">
            시행일: 2026년 6월 1일
          </p>
          <div className="space-y-8">
            {PRIVACY_SECTIONS.map(section => (
              <section key={section.title}>
                <h2 className="mb-3 text-[20px] font-bold tracking-normal text-[#2C3E50]">
                  {section.title}
                </h2>
                <ul className="space-y-2 text-[15px] leading-7 text-[#5A6A85]">
                  {section.items.map(item => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-3 size-1.5 shrink-0 rounded-full bg-[#7899C5]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
