import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ItemPicker } from './ItemPicker'

function ControlledPicker({ onContinue }: { onContinue: () => void }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  function toggle(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((existing) => existing !== id)
      if (current.length >= 5) return current
      return [...current, id]
    })
  }
  return <ItemPicker selectedIds={selectedIds} onToggle={toggle} onContinue={onContinue} />
}

describe('ItemPicker', () => {
  it('shows the running count and keeps the continue button disabled under 5', async () => {
    const user = userEvent.setup()
    render(<ControlledPicker onContinue={vi.fn()} />)

    expect(screen.getByText('0/5')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /生成我的宇宙/ })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: '恐龙' }))
    expect(screen.getByText('1/5')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '恐龙' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('deselects a selected item on second click', async () => {
    const user = userEvent.setup()
    render(<ControlledPicker onContinue={vi.fn()} />)

    const dino = screen.getByRole('button', { name: '恐龙' })
    await user.click(dino)
    await user.click(dino)

    expect(screen.getByText('0/5')).toBeInTheDocument()
    expect(dino).toHaveAttribute('aria-pressed', 'false')
  })

  it('enforces exactly five selections, disabling the rest once full', async () => {
    const user = userEvent.setup()
    render(<ControlledPicker onContinue={vi.fn()} />)

    const names = ['恐龙', '猫咪', '小狗', '兔子', '熊猫']
    for (const name of names) {
      await user.click(screen.getByRole('button', { name }))
    }

    expect(screen.getByText('5/5')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '星星' })).toBeDisabled()
    expect(screen.getByRole('button', { name: /生成我的宇宙/ })).toBeEnabled()

    // A selected item can still be toggled off even while "full".
    await user.click(screen.getByRole('button', { name: '熊猫' }))
    expect(screen.getByText('4/5')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '星星' })).toBeEnabled()
  })

  it('calls onContinue only once five items are selected', async () => {
    const user = userEvent.setup()
    const onContinue = vi.fn()
    render(<ControlledPicker onContinue={onContinue} />)

    for (const name of ['恐龙', '猫咪', '小狗', '兔子', '熊猫']) {
      await user.click(screen.getByRole('button', { name }))
    }
    await user.click(screen.getByRole('button', { name: /生成我的宇宙/ }))
    expect(onContinue).toHaveBeenCalledTimes(1)
  })
})
