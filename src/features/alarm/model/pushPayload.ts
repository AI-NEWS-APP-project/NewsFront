export type PushMessageType = 'KEYWORD_NEWS' | 'TODAY_NEWS' | 'TEST'

export interface PushMessageData {
  type?: PushMessageType
  route?: string
  keywordId?: string
  keywordNewsId?: string
  summaryId?: string
}

export function resolvePushRoute(data?: PushMessageData | null) {
  const route = data?.route

  if (!route || !route.startsWith('/')) {
    return '/'
  }

  return route
}
