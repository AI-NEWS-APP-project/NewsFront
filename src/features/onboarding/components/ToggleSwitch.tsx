interface ToggleSwitchProps {
  checked: boolean
  onToggle: () => void
  ariaLabel: string
}

export default function ToggleSwitch({
  checked,
  onToggle,
  ariaLabel,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={ariaLabel}
      aria-checked={checked}
      onClick={onToggle}
      className={`relative flex h-7 w-12 items-center rounded-full px-1 transition-colors duration-200 ${
        checked ? 'bg-[#729BC5]' : 'bg-[#C9D5E3]'
      }`}
    >
      <span
        className={`size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
