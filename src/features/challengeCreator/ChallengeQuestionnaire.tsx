import { useRef, useState, type FormEvent } from 'react'
import { validateAnswers, type AnswersByQuestionKey } from '../../content/promptTemplate'
import type { ChallengeQuestion } from '../../content/types'
import { t } from '../../i18n'

interface ChallengeQuestionnaireProps {
  questions: ChallengeQuestion[]
  /** Preserved when a parent returns here via "修改我的回答" instead of starting over. */
  initialAnswers?: AnswersByQuestionKey
  onSubmit: (answers: AnswersByQuestionKey) => void
  /** Fired once, on the very first interaction with any field. */
  onFirstInteraction?: () => void
}

type ErrorsByQuestionKey = Record<string, string | undefined>

const ERROR_MESSAGES: Record<string, string> = {
  required: '这个问题还没有回答',
  too_long: '回答超出了字数限制',
  invalid_option: '请从选项中选择',
}

function isAnswered(value: string | string[] | undefined): boolean {
  if (value === undefined) return false
  return Array.isArray(value) ? value.length > 0 : value.trim().length > 0
}

/**
 * Renders a challenge's question set dynamically from the typed content
 * model (`ChallengeQuestion[]`) — short/long text, single/multiple choice
 * — rather than one hardcoded form per challenge, per the Phase 2 brief's
 * "do not create a separate hardcoded page for each challenge" rule.
 * Required-field + max-length validation reuses `validateAnswers` from the
 * Phase 1 prompt-template engine so the public form and a future admin
 * preview can never disagree about what counts as valid.
 */
export function ChallengeQuestionnaire({
  questions,
  initialAnswers,
  onSubmit,
  onFirstInteraction,
}: ChallengeQuestionnaireProps) {
  const [answers, setAnswers] = useState<AnswersByQuestionKey>(initialAnswers ?? {})
  const [errors, setErrors] = useState<ErrorsByQuestionKey>({})
  const hasInteracted = useRef(false)

  const sortedQuestions = [...questions].sort((a, b) => a.displayOrder - b.displayOrder)
  const requiredQuestions = sortedQuestions.filter((q) => q.isRequired)
  const completedRequiredCount = requiredQuestions.filter((q) => isAnswered(answers[q.questionKey])).length

  function noteInteraction() {
    if (!hasInteracted.current) {
      hasInteracted.current = true
      onFirstInteraction?.()
    }
  }

  function setAnswer(questionKey: string, value: string | string[]) {
    noteInteraction()
    setAnswers((current) => ({ ...current, [questionKey]: value }))
    setErrors((current) => ({ ...current, [questionKey]: undefined }))
  }

  function toggleMultipleChoice(questionKey: string, optionValue: string) {
    noteInteraction()
    setAnswers((current) => {
      const existing = current[questionKey]
      const values = Array.isArray(existing) ? existing : []
      const next = values.includes(optionValue)
        ? values.filter((value) => value !== optionValue)
        : [...values, optionValue]
      return { ...current, [questionKey]: next }
    })
    setErrors((current) => ({ ...current, [questionKey]: undefined }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const validationErrors = validateAnswers(sortedQuestions, answers)

    if (validationErrors.length > 0) {
      const nextErrors: ErrorsByQuestionKey = {}
      for (const error of validationErrors) {
        nextErrors[error.questionKey] = ERROR_MESSAGES[error.reason]
      }
      setErrors(nextErrors)
      return
    }

    setErrors({})
    onSubmit(answers)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-medium sm:text-xl">{t.challenge.questionsHeading}</h2>
        {requiredQuestions.length > 0 && (
          <span className="shrink-0 text-xs font-medium text-ink-700/55">
            {t.challenge.progressDone} {completedRequiredCount}/{requiredQuestions.length}
          </span>
        )}
      </div>

      {sortedQuestions.map((question) => (
        <QuestionField
          key={question.id}
          question={question}
          value={answers[question.questionKey]}
          error={errors[question.questionKey]}
          onChangeValue={(value) => setAnswer(question.questionKey, value)}
          onToggleOption={(optionValue) => toggleMultipleChoice(question.questionKey, optionValue)}
        />
      ))}

      <div className="flex flex-col items-center gap-2 pt-2">
        <button
          type="submit"
          className="rounded-full bg-terracotta-500 px-6 py-3 text-base font-medium text-cream-50 shadow-[var(--shadow-card)] transition-colors duration-200 hover:bg-terracotta-600"
        >
          {t.challenge.submitCta}
        </button>
        {Object.values(errors).some(Boolean) && (
          <p role="alert" className="text-xs text-terracotta-600">
            {t.challenge.submitBlockedHint}
          </p>
        )}
      </div>
    </form>
  )
}

interface QuestionFieldProps {
  question: ChallengeQuestion
  value: string | string[] | undefined
  error: string | undefined
  onChangeValue: (value: string) => void
  onToggleOption: (optionValue: string) => void
}

function QuestionField({ question, value, error, onChangeValue, onToggleOption }: QuestionFieldProps) {
  const fieldId = `question-${question.id}`
  const helpId = question.helpText ? `${fieldId}-help` : undefined
  const errorId = error ? `${fieldId}-error` : undefined
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined
  const textValue = typeof value === 'string' ? value : ''
  const selectedValues = Array.isArray(value) ? value : []

  return (
    <fieldset className="flex flex-col gap-2 border-t border-ink-800/10 pt-5 first:border-t-0 first:pt-0">
      <label htmlFor={fieldId} className="flex flex-wrap items-baseline gap-2 text-sm font-medium text-ink-800">
        {question.promptLabel}
        <span
          className={`text-[11px] font-normal ${
            question.isRequired ? 'text-terracotta-600' : 'text-ink-700/45'
          }`}
        >
          {question.isRequired ? t.challenge.requiredMark : t.challenge.optionalMark}
        </span>
      </label>

      {question.helpText && (
        <p id={helpId} className="text-xs text-ink-700/55">
          {question.helpText}
        </p>
      )}

      {question.questionType === 'short_text' && (
        <input
          id={fieldId}
          type="text"
          value={textValue}
          maxLength={question.maxLength}
          aria-required={question.isRequired}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChangeValue(event.target.value)}
          className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3.5 py-2.5 text-base text-ink-800 placeholder:text-ink-700/35 focus:border-terracotta-400"
        />
      )}

      {question.questionType === 'long_text' && (
        <textarea
          id={fieldId}
          value={textValue}
          maxLength={question.maxLength}
          rows={3}
          aria-required={question.isRequired}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChangeValue(event.target.value)}
          className="w-full resize-none rounded-xl border border-ink-800/15 bg-cream-50 px-3.5 py-2.5 text-base text-ink-800 placeholder:text-ink-700/35 focus:border-terracotta-400"
        />
      )}

      {(question.questionType === 'short_text' || question.questionType === 'long_text') && (
        <span className="self-end text-[11px] text-ink-700/40">
          {textValue.length}/{question.maxLength}
        </span>
      )}

      {question.questionType === 'single_choice' && (
        <div
          id={fieldId}
          role="radiogroup"
          aria-required={question.isRequired}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="flex flex-wrap gap-2"
        >
          {(question.options ?? []).map((option) => {
            const selected = textValue === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChangeValue(option.value)}
                className={`rounded-full px-3.5 py-2 text-sm transition-colors duration-150 ${
                  selected
                    ? 'bg-terracotta-500 text-cream-50'
                    : 'bg-cream-100 text-ink-700/80 hover:bg-cream-200'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}

      {question.questionType === 'multiple_choice' && (
        <div
          id={fieldId}
          role="group"
          aria-required={question.isRequired}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="flex flex-wrap gap-2"
        >
          {(question.options ?? []).map((option) => {
            const selected = selectedValues.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                role="checkbox"
                aria-checked={selected}
                onClick={() => onToggleOption(option.value)}
                className={`rounded-full px-3.5 py-2 text-sm transition-colors duration-150 ${
                  selected
                    ? 'bg-terracotta-500 text-cream-50'
                    : 'bg-cream-100 text-ink-700/80 hover:bg-cream-200'
                }`}
              >
                {option.label}
              </button>
            )
          })}
          <span className="basis-full text-[11px] text-ink-700/40">{t.challenge.multipleChoiceHint}</span>
        </div>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs text-terracotta-600">
          {error}
        </p>
      )}
    </fieldset>
  )
}
