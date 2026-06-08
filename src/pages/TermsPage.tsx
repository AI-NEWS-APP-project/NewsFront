import Footer from '@shared/components/Footer'
import Header from '@shared/components/header'

const TERMS_SECTIONS = [
  {
    title: '서비스 이용',
    items: [
      'BRIEFY는 관심 키워드 기반 뉴스 요약, 데일리 브리핑, 알림 기능을 제공합니다.',
      '사용자는 정확한 계정 정보를 등록하고 본인의 계정을 안전하게 관리해야 합니다.',
      '서비스의 일부 기능은 로그인 또는 회원가입 후 이용할 수 있습니다.',
    ],
  },
  {
    title: '사용자의 의무',
    items: [
      '타인의 계정을 무단으로 사용하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다.',
      '불법적이거나 부적절한 목적으로 서비스를 이용할 수 없습니다.',
      '서비스에서 제공되는 콘텐츠를 무단 복제, 배포, 상업적으로 이용해서는 안 됩니다.',
    ],
  },
  {
    title: '콘텐츠와 알림',
    items: [
      '뉴스 요약과 브리핑은 원문 기사 및 외부 정보를 기반으로 생성될 수 있습니다.',
      'BRIEFY는 정보의 정확성을 높이기 위해 노력하지만, 중요한 의사결정에는 원문과 추가 자료를 함께 확인해야 합니다.',
      '사용자는 설정 페이지에서 알림 수신 여부와 관심 키워드를 변경할 수 있습니다.',
    ],
  },
  {
    title: '서비스 변경 및 중단',
    items: [
      '기능 개선, 점검, 운영상 필요에 따라 서비스 내용이 변경되거나 일시 중단될 수 있습니다.',
      '약관이 변경되는 경우 서비스 화면 또는 별도 안내를 통해 공지합니다.',
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FBFD] font-sans text-[#2C3E50]">
      <Header />
      <main className="mx-auto w-full max-w-4xl px-6 pt-24 pb-16 text-left">
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold text-[#7899C5]">BRIEFY Terms</p>
          <h1 className="mb-4 text-[34px] font-bold tracking-normal text-[#2C3E50]">
            이용약관
          </h1>
          <p className="text-[15px] leading-7 text-[#5A6A85]">
            이 약관은 BRIEFY 서비스 이용에 필요한 기본 조건과 사용자 권리,
            의무를 안내합니다.
          </p>
        </div>

        <section className="rounded-[24px] border border-[#D9E5F3] bg-white p-7 shadow-[0_10px_28px_rgba(73,98,128,0.08)]">
          <p className="mb-7 text-sm font-semibold text-[#7A92B5]">
            시행일: 2026년 6월 1일
          </p>
          <div className="space-y-8">
            {TERMS_SECTIONS.map(section => (
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
