import type { KeywordNewsGroup, NewsItem } from '@features/news/model/types'

export const NEWS_KEYWORDS = [
  '전체',
  'AI',
  '경제',
  'IT',
  '스타트업',
  '부동산',
  '주식',
  '건강',
  '환경',
] as const

export const MOCK_AI_NEWS: NewsItem[] = [
  {
    id: 1,
    keyword: 'AI',
    title: 'AI 기술의 급격한 발전, 2026년 트렌드 전망',
    time: '2시간 전',
    date: '2026.03.24',
  },
  {
    id: 2,
    keyword: '경제',
    title: '국내 경제 성장률 2.8% 기록',
    time: '3시간 전',
    date: '2026.03.24',
  },
  {
    id: 3,
    keyword: 'IT',
    title: "새로운 프로그래밍 언어 'Mojo' 공개",
    time: '1시간 전',
    date: '2026.03.24',
  },
  {
    id: 4,
    keyword: '스타트업',
    title: '스타트업 투자 시장 활성화',
    time: '5시간 전',
    date: '2026.03.24',
  },
]

export const MOCK_NEWS_LIST: NewsItem[] = [
  ...MOCK_AI_NEWS,
  {
    id: 5,
    keyword: 'AI',
    title: '구글 AI 모델 업데이트',
    time: '7시간 전',
    date: '2026.03.23',
  },
  {
    id: 6,
    keyword: '경제',
    title: '코스피 상승세 지속',
    time: '1일 전',
    date: '2026.03.23',
  },
  {
    id: 7,
    keyword: 'IT',
    title: '클라우드 시장 성장',
    time: '1일 전',
    date: '2026.03.23',
  },
  {
    id: 8,
    keyword: '스타트업',
    title: '신규 스타트업 지원 정책',
    time: '2일 전',
    date: '2026.03.22',
  },
  {
    id: 9,
    keyword: '건강',
    title: 'AI로 암 진단 정확도 향상',
    time: '2일 전',
    date: '2026.03.22',
  },
  {
    id: 10,
    keyword: '부동산',
    title: '서울 아파트 거래량 3개월 연속 증가',
    time: '2일 전',
    date: '2026.03.22',
  },
  {
    id: 11,
    keyword: '주식',
    title: '반도체 업종 강세에 외국인 순매수 확대',
    time: '3일 전',
    date: '2026.03.21',
  },
  {
    id: 12,
    keyword: '환경',
    title: '탄소중립 기술 투자 확대에 친환경 산업 주목',
    time: '3일 전',
    date: '2026.03.21',
  },
]

export const MOCK_KEYWORD_NEWS: KeywordNewsGroup[] = [
  {
    keyword: 'AI',
    count: 12,
    news: [
      {
        id: 5,
        title: "구글, 차세대 AI 모델 '제미나이 울트라' 공개",
        date: '2026.03.24',
      },
      {
        id: 6,
        title: "AI 스타트업 '오픈AI', 새로운 투자 유치",
        date: '2026.03.23',
      },
      {
        id: 7,
        title: 'AI로 암 진단 정확도 90% 달성',
        date: '2026.03.23',
      },
    ],
  },
  {
    keyword: '경제',
    count: 8,
    news: [
      {
        id: 8,
        title: '1분기 경제성장률 2.8% 기록',
        date: '2026.03.24',
      },
      {
        id: 9,
        title: '코스피, 3000선 회복 전망',
        date: '2026.03.23',
      },
      {
        id: 10,
        title: '원달러 환율 하락세 지속',
        date: '2026.03.22',
      },
    ],
  },
]
