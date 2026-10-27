import { describe, expect, it } from 'vitest'
import { DEMO_CHALLENGES } from './demoChallenges'
import { resolvePromptTemplate, validateTemplate } from './promptTemplate'
import type { ChallengeStatus } from './types'

describe('DEMO_CHALLENGES (mock content)', () => {
  it('contains more than one challenge, across both statuses', () => {
    expect(DEMO_CHALLENGES.length).toBeGreaterThan(1)
    const statuses = new Set<ChallengeStatus>(DEMO_CHALLENGES.map((c) => c.status))
    expect(statuses.has('published')).toBe(true)
    expect(statuses.has('draft')).toBe(true)
  })

  it('has unique, URL-safe slugs', () => {
    const slugs = DEMO_CHALLENGES.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it.each(DEMO_CHALLENGES)(
    'challenge "$title" has a prompt template valid against its own questions',
    (challenge) => {
      const result = validateTemplate(challenge.promptTemplate, challenge.questions)
      expect(result).toEqual({
        valid: true,
        unknownPlaceholders: [],
        unusedRequiredQuestionKeys: [],
      })
    },
  )

  it.each(DEMO_CHALLENGES)(
    'challenge "$title" resolves to a non-empty prompt given example answers for every question',
    (challenge) => {
      const exampleAnswers: Record<string, string> = {}
      for (const question of challenge.questions) {
        exampleAnswers[question.questionKey] =
          question.questionType === 'single_choice' || question.questionType === 'multiple_choice'
            ? (question.options?.[0]?.value ?? '')
            : '示例答案'
      }

      const resolved = resolvePromptTemplate(challenge.promptTemplate, challenge.questions, exampleAnswers)
      expect(resolved.length).toBeGreaterThan(0)
      // Every placeholder should have resolved — no literal "{{" left behind.
      expect(resolved).not.toContain('{{')
    },
  )
})
