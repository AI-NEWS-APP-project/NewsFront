import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type SettingsTab = 'keyword' | 'alarm'

interface SettingsPanelWidgetProps {
  activeTab: SettingsTab
  keywordContent: ReactNode
  alarmContent: ReactNode
}

function SettingsPanelWidget({
  activeTab,
  keywordContent,
  alarmContent,
}: SettingsPanelWidgetProps) {
  return (
    <section className="mx-auto w-full max-w-205 rounded-[20px] border border-[#DDEAF7] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(120,153,197,0.12)] sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <div className="mb-5 text-center sm:mb-6">
        <div className="inline-flex h-7 items-center rounded-full bg-[#E8F1F9] px-3 text-[12px] font-bold text-[#6A95C1]">
          설정
        </div>
        <div className="mt-3 text-[19px] font-extrabold tracking-tight text-[#33475E] sm:text-[24px]">
          {activeTab === 'keyword' ? '관심 키워드 설정' : '알림 설정'}
        </div>
        <div className="mt-1.5 text-[12px] text-[#7F97B7] sm:text-[13px]">
          {activeTab === 'keyword'
            ? '구독할 키워드를 추가하거나 정리해보세요'
            : '알림 받을 방식을 선택해주세요'}
        </div>
      </div>

      <div className="mx-auto mb-5 grid max-w-147 gap-2.5 md:grid-cols-2">
        <Link
          to="/setting/keyword"
          className={`flex h-10 items-center justify-center rounded-xl border text-[14px] font-bold transition-all ${
            activeTab === 'keyword'
              ? 'border-[#729BC5] bg-[#729BC5] text-white shadow-[0_10px_22px_rgba(114,155,197,0.24)]'
              : 'border-[#DCE9F6] bg-white text-[#729BC5] hover:bg-[#F8FBFD]'
          }`}
        >
          키워드 관리
        </Link>
        <Link
          to="/setting/alarm"
          className={`flex h-10 items-center justify-center rounded-xl border text-[14px] font-bold transition-all ${
            activeTab === 'alarm'
              ? 'border-[#729BC5] bg-[#729BC5] text-white shadow-[0_10px_22px_rgba(114,155,197,0.24)]'
              : 'border-[#DCE9F6] bg-white text-[#729BC5] hover:bg-[#F8FBFD]'
          }`}
        >
          알림 설정
        </Link>
      </div>

      {activeTab === 'keyword' ? keywordContent : alarmContent}
    </section>
  )
}

export default SettingsPanelWidget
