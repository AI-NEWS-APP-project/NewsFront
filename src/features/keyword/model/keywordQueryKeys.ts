export const keywordKeys = {
  all: ['keywords'] as const,
  lists: () => [...keywordKeys.all, 'list'] as const,
  list: (userId: number | string) => [...keywordKeys.lists(), userId] as const,
  popular: () => [...keywordKeys.all, 'popular'] as const,
}
