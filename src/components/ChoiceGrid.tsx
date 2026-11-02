import type { ChoiceIcon, ChoiceOption } from '../hunt'

type ChoiceGridProps = {
  eyebrow: string
  title: string
  lede: string
  options: ChoiceOption[]
  onPick: (option: ChoiceOption) => void
}

function ChoiceGlyph({ name }: { name: ChoiceIcon }) {
  if (name === 'note') {
    return (
      <svg className="choice-card__icon" viewBox="0 0 48 48" aria-hidden="true">
        <ellipse cx="14" cy="34" rx="6.2" ry="4.6" transform="rotate(-22 14 34)" fill="currentColor" />
        <ellipse cx="30.5" cy="30.5" rx="6.2" ry="4.6" transform="rotate(-22 30.5 30.5)" fill="currentColor" />
        <path
          d="M19.2 33.2V12.5l17.3-3.8v20.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.2 12.5h17.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.4"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg className="choice-card__icon" viewBox="0 0 32 32" aria-hidden="true">
      <rect
        x="4.5"
        y="7.5"
        width="23"
        height="17"
        rx="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <circle cx="11.2" cy="13.4" r="2.1" fill="currentColor" />
      <path
        d="M8.8 21.4 14 16.6l3.4 3.2 4.2-5.1 5.1 6.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChoiceGrid({
  eyebrow,
  title,
  lede,
  options,
  onPick,
}: ChoiceGridProps) {
  return (
    <section className="panel choice">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lede">{lede}</p>
      <div className="choice-grid">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="choice-card"
            onClick={() => onPick(option)}
          >
            {option.icon && (
              <span className="choice-card__art">
                <ChoiceGlyph name={option.icon} />
              </span>
            )}
            <span className="choice-card__label">{option.label}</span>
            <span className="choice-card__hint">{option.hint}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
