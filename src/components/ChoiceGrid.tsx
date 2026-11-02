import type { ChoiceOption } from '../hunt'

type ChoiceGridProps = {
  eyebrow: string
  title: string
  lede: string
  options: ChoiceOption[]
  onPick: (option: ChoiceOption) => void
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
            <span className="choice-card__label">{option.label}</span>
            <span className="choice-card__hint">{option.hint}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
