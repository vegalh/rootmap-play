/**
 * Deterministic, placeholder-based prompt template engine.
 *
 * This is NOT an AI feature — it is plain string substitution. It must
 * stay that way:
 * - Never use `eval`, `Function(...)`, or any form of arbitrary JavaScript
 *   execution on admin- or parent-supplied text.
 * - Never render parent answers as HTML — they are always treated as
 *   plain text (if this is ever rendered into the DOM, it must go through
 *   React's default text-node escaping, never `dangerouslySetInnerHTML`).
 * - Placeholders are matched with a fixed, simple regular expression, not
 *   a general-purpose template language.
 *
 * Pure functions only — no network calls, no DOM access — so this module
 * is usable from both the future public prompt generator (Phase 2) and the
 * admin template editor's live preview (Phase 3) without duplicating the
 * rules, and is fully unit-testable on its own (see promptTemplate.test.ts).
 */
import type { ChallengeQuestion, QuestionOption } from './types'

const PLACEHOLDER_PATTERN = /\{\{\s*([a-z][a-z0-9_]*)\s*\}\}/gi

/**
 * Every `{{question_key}}` placeholder referenced by a template, in order
 * of first appearance, de-duplicated.
 */
export function extractPlaceholders(template: string): string[] {
  const seen = new Set<string>()
  const ordered: string[] = []
  for (const match of template.matchAll(PLACEHOLDER_PATTERN)) {
    const key = match[1].toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      ordered.push(key)
    }
  }
  return ordered
}

export interface TemplateValidationResult {
  /**
   * True only when every placeholder in the template matches a real
   * question AND every required question is actually used by the
   * template. Both conditions are treated as publish-blocking: an unknown
   * placeholder can never resolve to anything, and a required question
   * whose answer is silently discarded is very likely an authoring
   * mistake the admin editor should surface before publishing.
   */
  valid: boolean
  /** Placeholders present in the template with no matching question. */
  unknownPlaceholders: string[]
  /** Required questions never referenced anywhere in the template. */
  unusedRequiredQuestionKeys: string[]
}

/** Validates a challenge's prompt template against its question set. */
export function validateTemplate(
  template: string,
  questions: Pick<ChallengeQuestion, 'questionKey' | 'isRequired'>[],
): TemplateValidationResult {
  const placeholders = extractPlaceholders(template)
  const questionKeys = new Set(questions.map((q) => q.questionKey))
  const placeholderSet = new Set(placeholders)

  const unknownPlaceholders = placeholders.filter((key) => !questionKeys.has(key))
  const unusedRequiredQuestionKeys = questions
    .filter((q) => q.isRequired && !placeholderSet.has(q.questionKey))
    .map((q) => q.questionKey)

  return {
    valid: unknownPlaceholders.length === 0 && unusedRequiredQuestionKeys.length === 0,
    unknownPlaceholders,
    unusedRequiredQuestionKeys,
  }
}

export type AnswerValue = string | string[]
export type AnswersByQuestionKey = Record<string, AnswerValue | undefined>

export interface AnswerValidationError {
  questionKey: string
  reason: 'required' | 'too_long' | 'invalid_option'
}

/**
 * Validates parent-supplied answers against the question definitions
 * before they're used to resolve a prompt — guards against missing
 * required answers, excessively long free-text submissions, and choice
 * values that aren't one of the question's defined options.
 */
export function validateAnswers(
  questions: ChallengeQuestion[],
  answers: AnswersByQuestionKey,
): AnswerValidationError[] {
  const errors: AnswerValidationError[] = []

  for (const question of questions) {
    const raw = answers[question.questionKey]
    const isBlank =
      raw === undefined ||
      raw === null ||
      (Array.isArray(raw) ? raw.length === 0 : raw.trim().length === 0)

    if (isBlank) {
      if (question.isRequired) {
        errors.push({ questionKey: question.questionKey, reason: 'required' })
      }
      continue
    }

    if (question.questionType === 'short_text' || question.questionType === 'long_text') {
      const text = Array.isArray(raw) ? raw.join('') : raw
      if (text.length > question.maxLength) {
        errors.push({ questionKey: question.questionKey, reason: 'too_long' })
      }
    } else {
      const validValues = new Set((question.options ?? []).map((option) => option.value))
      const values = Array.isArray(raw) ? raw : [raw]
      if (values.some((value) => !validValues.has(value))) {
        errors.push({ questionKey: question.questionKey, reason: 'invalid_option' })
      }
    }
  }

  return errors
}

function optionLabel(options: QuestionOption[] | undefined, value: string): string {
  return options?.find((option) => option.value === value)?.label ?? value
}

/** Renders a single answer value to the plain text inserted into a prompt. */
function renderAnswerText(question: ChallengeQuestion, value: AnswerValue): string {
  if (question.questionType === 'single_choice') {
    const single = Array.isArray(value) ? value[0] : value
    return single ? optionLabel(question.options, single) : ''
  }
  if (question.questionType === 'multiple_choice') {
    const values = Array.isArray(value) ? value : [value]
    return values
      .filter(Boolean)
      .map((v) => optionLabel(question.options, v))
      .join('、')
  }
  // short_text / long_text: always plain text, never executed or
  // rendered as HTML/markup.
  return Array.isArray(value) ? value.join('、') : value
}

/**
 * Resolves a prompt template against a set of answers.
 *
 * - Known placeholders are replaced with the corresponding answer's plain
 *   text (or an empty string for a blank optional answer — callers should
 *   design templates so a blank optional answer still reads naturally; see
 *   docs/PRODUCT_PIVOT.md).
 * - Unknown placeholders (no matching question — should have been caught
 *   by `validateTemplate` before publishing) are left untouched rather
 *   than silently dropped, so a template authoring mistake stays visible
 *   instead of disappearing.
 * - This never evaluates the template as code; it is a single pass of
 *   literal string replacement.
 */
export function resolvePromptTemplate(
  template: string,
  questions: ChallengeQuestion[],
  answers: AnswersByQuestionKey,
): string {
  const questionByKey = new Map(questions.map((q) => [q.questionKey, q] as const))

  return template.replace(PLACEHOLDER_PATTERN, (fullMatch, rawKey: string) => {
    const key = rawKey.toLowerCase()
    const question = questionByKey.get(key)
    if (!question) return fullMatch

    const value = answers[key]
    if (value === undefined || value === null) return ''
    return renderAnswerText(question, value)
  })
}
