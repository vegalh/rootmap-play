import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { DEMO_CHALLENGES } from '../../content/demoChallenges'
import { ChallengeQuestionnaire } from './ChallengeQuestionnaire'

const pocketUniverseQuestions = DEMO_CHALLENGES.find((c) => c.slug === 'pocket-universe')!.questions

describe('ChallengeQuestionnaire', () => {
  it('renders one field per question, sorted by displayOrder', () => {
    render(<ChallengeQuestionnaire questions={pocketUniverseQuestions} onSubmit={vi.fn()} />)

    expect(screen.getByLabelText(/宝宝最近最喜欢什么/)).toBeInTheDocument()
    expect(screen.getByLabelText(/宝宝有什么特别的小习惯/)).toBeInTheDocument()
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })

  it('blocks submission and shows an error when a required field is empty', () => {
    const onSubmit = vi.fn()
    render(<ChallengeQuestionnaire questions={pocketUniverseQuestions} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: /生成我的创作咒语/ }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
  })

  it('submits all answers once every required field is filled, leaving optional fields out', () => {
    const onSubmit = vi.fn()
    render(<ChallengeQuestionnaire questions={pocketUniverseQuestions} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/宝宝最近最喜欢什么/), {
      target: { value: '恐龙和星星' },
    })
    fireEvent.click(screen.getByRole('radio', { name: '温暖、梦幻' }))
    fireEvent.click(screen.getByRole('button', { name: /生成我的创作咒语/ }))

    expect(onSubmit).toHaveBeenCalledWith({
      favorite_things: '恐龙和星星',
      mood: 'warm_dreamy',
    })
  })

  it('fires onFirstInteraction exactly once, on the first field change', () => {
    const onFirstInteraction = vi.fn()
    render(
      <ChallengeQuestionnaire
        questions={pocketUniverseQuestions}
        onSubmit={vi.fn()}
        onFirstInteraction={onFirstInteraction}
      />,
    )

    fireEvent.change(screen.getByLabelText(/宝宝最近最喜欢什么/), { target: { value: 'a' } })
    fireEvent.change(screen.getByLabelText(/宝宝最近最喜欢什么/), { target: { value: 'ab' } })
    fireEvent.click(screen.getByRole('radio', { name: '安静、治愈' }))

    expect(onFirstInteraction).toHaveBeenCalledTimes(1)
  })

  it('pre-fills fields from initialAnswers, supporting the "edit my answers" round-trip', () => {
    render(
      <ChallengeQuestionnaire
        questions={pocketUniverseQuestions}
        initialAnswers={{ favorite_things: '小火车', mood: 'playful' }}
        onSubmit={vi.fn()}
      />,
    )

    expect(screen.getByLabelText(/宝宝最近最喜欢什么/)).toHaveValue('小火车')
    expect(screen.getByRole('radio', { name: '活泼、有趣' })).toHaveAttribute('aria-checked', 'true')
  })
})
