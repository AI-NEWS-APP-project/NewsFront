export interface SourceArticle {
  id: number
  title: string
  source: string
  date: string
  url: string
}

export interface NewsDetail {
  id: number
  title: string
  keywords: string[]
  source: string
  date: string
  summary: string
  sourceArticles: SourceArticle[]
}

export const MOCK_NEWS_DETAIL: NewsDetail = {
  id: 1,
  title: 'AI 기술의 급격한 발전, 2026년 트렌드 전망',
  keywords: ['AI', 'IT'],
  source: 'Tech News Korea',
  date: '2026.03.24',
  summary:
    '인공지능 기술이 빠르게 발전하면서 다양한 산업 분야에서 혁신이 일어나고 있습니다. 생성형 AI는 업무 효율성을 크게 향상시키고 있으며, 의료, 금융, 제조 등 전 산업에 걸쳐 AI 도입이 가속화되고 있습니다.\n\n특히 2026년에는 멀티모달 AI가 주목받고 있습니다. 텍스트뿐만 아니라 이미지, 음성, 영상을 동시에 처리할 수 있는 AI 모델이 상용화되면서 더욱 자연스러운 인간-AI 상호작용이 가능해졌습니다.\n\n전문가들은 AI 기술의 발전으로 향후 5년 내에 많은 직업이 변화하거나 새롭게 생겨날 것으로 예상하고 있습니다. 동시에 AI 윤리와 규제에 대한 논의도 활발해지고 있어, 기술 발전과 함께 사회적 합의가 중요한 과제로 떠오르고 있습니다.',
  sourceArticles: [
    {
      id: 1,
      title: "OpenAI, GPT-5 공개 예정... '인간 수준의 AI' 목표",
      source: '테크크런치',
      date: '2026.03.24',
      url: 'https://example.com/1',
    },
    {
      id: 2,
      title: '구글 딥마인드, 의료 AI로 암 조기 진단 성공률 95% 달성',
      source: 'MIT 테크놀로지 리뷰',
      date: '2026.03.24',
      url: 'https://example.com/2',
    },
    {
      id: 3,
      title: '애플, AI 칩 자체 개발... 성능 30% 향상',
      source: '블룸버그',
      date: '2026.03.23',
      url: 'https://example.com/3',
    },
    {
      id: 4,
      title: '마이크로소프트, AI 코파일럿 기능 확대',
      source: '더버지',
      date: '2026.03.23',
      url: 'https://example.com/4',
    },
    {
      id: 5,
      title: "메타, 오픈소스 AI 모델 'Llama 4' 출시",
      source: '벤처비트',
      date: '2026.03.23',
      url: 'https://example.com/5',
    },
    {
      id: 6,
      title: '삼성전자, AI 반도체 시장 공략 강화',
      source: '전자신문',
      date: '2026.03.22',
      url: 'https://example.com/6',
    },
    {
      id: 7,
      title: '테슬라, AI 기반 자율주행 레벨 5 달성 임박',
      source: '로이터',
      date: '2026.03.22',
      url: 'https://example.com/7',
    },
    {
      id: 8,
      title: '중국 바이두, AI 검색 엔진 사용자 1억 돌파',
      source: '사우스차이나모닝포스트',
      date: '2026.03.22',
      url: 'https://example.com/8',
    },
    {
      id: 9,
      title: 'AI 스타트업 투자, 1분기에만 100억 달러 유치',
      source: 'CB인사이트',
      date: '2026.03.21',
      url: 'https://example.com/9',
    },
    {
      id: 10,
      title: '유럽연합, AI 규제법 최종 승인... 전 세계 영향',
      source: '파이낸셜타임스',
      date: '2026.03.21',
      url: 'https://example.com/10',
    },
    {
      id: 11,
      title: 'AI 교육 플랫폼, 학습 효율 2배 증가 효과',
      source: '에듀케이션위크',
      date: '2026.03.21',
      url: 'https://example.com/11',
    },
    {
      id: 12,
      title: 'AI 윤리 가이드라인, 글로벌 기업 80% 도입',
      source: '포브스',
      date: '2026.03.20',
      url: 'https://example.com/12',
    },
  ],
}
