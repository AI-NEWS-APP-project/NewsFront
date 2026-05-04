import Button from '@shared/components/Button'

interface KeywordOptionButtonProps {
  keyword: string
  onClick: () => void
}

export default function KeywordOptionButton({
  keyword,
  onClick,
}: KeywordOptionButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant="outline"
      size="chip"
      fullWidth={false}
      className="h-8 px-3.5 text-[12px]"
    >
      {keyword}
    </Button>
  )
}
