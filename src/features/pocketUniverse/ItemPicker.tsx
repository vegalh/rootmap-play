import { t } from '../../i18n'
import { CATEGORIES, ITEMS, itemsByCategory } from './items'

interface ItemPickerProps {
  selectedIds: string[]
  onToggle: (id: string) => void
  onContinue: () => void
}

const REQUIRED_COUNT = 5

/**
 * Step 1 — the visual five-item selection grid. Illustrated toggle tiles
 * grouped by category, with a clear running "x/5" count and a primary
 * action that only unlocks once exactly five things are chosen.
 */
export function ItemPicker({ selectedIds, onToggle, onContinue }: ItemPickerProps) {
  const count = selectedIds.length
  const isFull = count >= REQUIRED_COUNT

  return (
    <div className="flex flex-col gap-8">
      <div className="sticky top-0 z-10 -mx-5 flex items-center justify-between bg-cream-50/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <p className="text-sm font-medium text-ink-800">
          {t.pocketUniverseCreator.selectStepHint}
          <span className="ml-2 text-terracotta-600">
            {count}/{REQUIRED_COUNT}
          </span>
        </p>
        <button
          type="button"
          onClick={onContinue}
          disabled={!isFull}
          className="rounded-full bg-terracotta-500 px-5 py-2 text-sm font-medium text-cream-50 shadow-[var(--shadow-card)] transition-colors duration-200 hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:bg-ink-800/10 disabled:text-ink-700/50 disabled:shadow-none"
        >
          {t.pocketUniverseCreator.generateCta}
        </button>
      </div>

      {CATEGORIES.map((category) => (
        <fieldset key={category.id} className="flex flex-col gap-3">
          <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-700/50">
            {category.label}
          </legend>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {itemsByCategory(category.id).map((item) => {
              const selected = selectedIds.includes(item.id)
              const disabled = !selected && isFull
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  disabled={disabled}
                  onClick={() => onToggle(item.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-2 transition-all duration-150 ${
                    selected
                      ? 'border-terracotta-500 bg-terracotta-500/10 shadow-[var(--shadow-card)]'
                      : 'border-transparent bg-cream-100 hover:border-terracotta-400/40'
                  } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
                >
                  <svg viewBox="0 0 100 100" className="h-12 w-12 sm:h-14 sm:w-14" aria-hidden="true">
                    {item.render()}
                  </svg>
                  <span className="text-xs text-ink-700/80">{item.label}</span>
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}

      <p className="text-center text-xs text-ink-700/40">共 {ITEMS.length} 件小事物，挑 5 件最喜欢的吧</p>
    </div>
  )
}
