import { describe, expect, it } from 'vitest'
import type { ChallengeQuestion } from './types'
import {
  extractPlaceholders,
  resolvePromptTemplate,
  validateAnswers,
  validateTemplate,
} from './promptTemplate'

const FAVORITE_THINGS: ChallengeQuestion = {
  id: 'q1',
  challengeId: 'c1',
  questionKey: 'favorite_things',
  promptLabel: '宝宝最近最喜欢什么？',
  questionType: 'short_text',
  isRequired: true,
  maxLength: 10,
  displayOrder: 1,
}

const SPECIAL_HABIT: ChallengeQuestion = {
  id: 'q2',
  challengeId: 'c1',
  questionKey: 'special_habit',
  promptLabel: '宝宝有什么特别的小习惯？',
  questionType: 'short_text',
  isRequired: false,
  maxLength: 200,
  displayOrder: 2,
}

const MOOD: ChallengeQuestion = {
  id: 'q3',
  challengeId: 'c1',
  questionKey: 'mood',
  promptLabel: '你希望这个世界是什么感觉？',
  questionType: 'single_choice',
  isRequired: true,
  maxLength: 200,
  displayOrder: 3,
  options: [
    { value: 'warm_dreamy', label: '温暖、梦幻' },
    { value: 'adventurous', label: '有一点冒险感' },
  ],
}

const FAVORITE_ANIMALS: ChallengeQuestion = {
  id: 'q4',
  challengeId: 'c1',
  questionKey: 'favorite_animals',
  promptLabel: '宝宝喜欢哪些小动物？',
  questionType: 'multiple_choice',
  isRequired: false,
  maxLength: 200,
  displayOrder: 4,
  options: [
    { value: 'cat', label: '小猫' },
    { value: 'dog', label: '小狗' },
    { value: 'dino', label: '恐龙' },
  ],
}

const QUESTIONS = [FAVORITE_THINGS, SPECIAL_HABIT, MOOD, FAVORITE_ANIMALS]
const TEMPLATE =
  '请根据以下信息创作插画：{{favorite_things}}。宝宝的特别习惯是：{{special_habit}}。整体氛围：{{mood}}。'

describe('extractPlaceholders', () => {
  it('returns unique placeholder keys in order of first appearance', () => {
    expect(extractPlaceholders(TEMPLATE)).toEqual(['favorite_things', 'special_habit', 'mood'])
  })

  it('de-duplicates a placeholder used more than once', () => {
    expect(extractPlaceholders('{{mood}} ... {{mood}}')).toEqual(['mood'])
  })

  it('returns an empty array when there are no placeholders', () => {
    expect(extractPlaceholders('一段没有占位符的文字。')).toEqual([])
  })

  it('is case-insensitive and tolerates internal whitespace', () => {
    expect(extractPlaceholders('{{ Mood }}')).toEqual(['mood'])
  })
})

describe('validateTemplate', () => {
  it('is valid when every placeholder matches a question and every required question is used', () => {
    const result = validateTemplate(TEMPLATE, QUESTIONS)
    expect(result.valid).toBe(true)
    expect(result.unknownPlaceholders).toEqual([])
    expect(result.unusedRequiredQuestionKeys).toEqual([])
  })

  it('flags a placeholder with no matching question', () => {
    const result = validateTemplate('{{nonexistent_key}}', QUESTIONS)
    expect(result.valid).toBe(false)
    expect(result.unknownPlaceholders).toEqual(['nonexistent_key'])
  })

  it('flags a required question never referenced by the template', () => {
    const result = validateTemplate('{{favorite_things}}', QUESTIONS)
    expect(result.valid).toBe(false)
    // mood is required and not referenced; special_habit/favorite_animals
    // are optional, so their absence does not fail validation.
    expect(result.unusedRequiredQuestionKeys).toEqual(['mood'])
  })

  it('does not require optional questions to be referenced', () => {
    const result = validateTemplate('{{favorite_things}}。{{mood}}。', QUESTIONS)
    expect(result.valid).toBe(true)
  })
})

describe('validateAnswers', () => {
  it('passes with all required answers present and within length', () => {
    const errors = validateAnswers(QUESTIONS, {
      favorite_things: '恐龙',
      mood: 'warm_dreamy',
    })
    expect(errors).toEqual([])
  })

  it('reports a missing required answer', () => {
    const errors = validateAnswers(QUESTIONS, { mood: 'warm_dreamy' })
    expect(errors).toEqual([{ questionKey: 'favorite_things', reason: 'required' }])
  })

  it('does not require optional answers', () => {
    const errors = validateAnswers(QUESTIONS, {
      favorite_things: '恐龙',
      mood: 'warm_dreamy',
    })
    expect(errors.find((e) => e.questionKey === 'special_habit')).toBeUndefined()
  })

  it('reports an answer that exceeds max length', () => {
    const errors = validateAnswers(QUESTIONS, {
      favorite_things: '超过十个字符的一个很长的答案',
      mood: 'warm_dreamy',
    })
    expect(errors).toContainEqual({ questionKey: 'favorite_things', reason: 'too_long' })
  })

  it('reports a choice value that is not a defined option', () => {
    const errors = validateAnswers(QUESTIONS, {
      favorite_things: '恐龙',
      mood: 'not_a_real_option',
    })
    expect(errors).toContainEqual({ questionKey: 'mood', reason: 'invalid_option' })
  })

  it('treats a blank string the same as a missing answer', () => {
    const errors = validateAnswers(QUESTIONS, { favorite_things: '   ', mood: 'warm_dreamy' })
    expect(errors).toContainEqual({ questionKey: 'favorite_things', reason: 'required' })
  })
})

describe('resolvePromptTemplate', () => {
  it('substitutes free-text answers as plain text', () => {
    const result = resolvePromptTemplate(TEMPLATE, QUESTIONS, {
      favorite_things: '恐龙、草莓蛋糕',
      special_habit: '喜欢把东西拆开研究',
      mood: 'warm_dreamy',
    })
    expect(result).toBe(
      '请根据以下信息创作插画：恐龙、草莓蛋糕。宝宝的特别习惯是：喜欢把东西拆开研究。整体氛围：温暖、梦幻。',
    )
  })

  it('resolves a blank optional answer to an empty string rather than throwing', () => {
    const result = resolvePromptTemplate(TEMPLATE, QUESTIONS, {
      favorite_things: '恐龙',
      mood: 'warm_dreamy',
    })
    expect(result).toBe('请根据以下信息创作插画：恐龙。宝宝的特别习惯是：。整体氛围：温暖、梦幻。')
  })

  it('renders a single_choice answer using its option label, not its raw value', () => {
    const result = resolvePromptTemplate('{{mood}}', QUESTIONS, { mood: 'adventurous' })
    expect(result).toBe('有一点冒险感')
  })

  it('renders a multiple_choice answer by joining option labels with 、', () => {
    const result = resolvePromptTemplate('{{favorite_animals}}', QUESTIONS, {
      favorite_animals: ['cat', 'dino'],
    })
    expect(result).toBe('小猫、恐龙')
  })

  it('leaves an unknown placeholder untouched instead of silently dropping it', () => {
    const result = resolvePromptTemplate('{{not_a_question}}', QUESTIONS, {})
    expect(result).toBe('{{not_a_question}}')
  })

  it('never executes answer text as code and treats it as plain data', () => {
    const maliciousAnswer = '"); process.exit(1); //'
    const result = resolvePromptTemplate('{{favorite_things}}', QUESTIONS, {
      favorite_things: maliciousAnswer,
    })
    expect(result).toBe(maliciousAnswer)
  })
})
