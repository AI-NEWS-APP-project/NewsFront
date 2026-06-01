export const notificationKeys = {
  all: ['notifications'] as const,
  lists: (userId: number | string) =>
    [...notificationKeys.all, userId, 'list'] as const,
  list: (userId: number | string, page: number, size: number) =>
    [...notificationKeys.lists(userId), page, size] as const,
  unreadCount: (userId: number | string) =>
    [...notificationKeys.all, userId, 'unread-count'] as const,
}
