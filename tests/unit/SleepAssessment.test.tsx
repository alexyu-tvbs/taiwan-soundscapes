import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { MotionGlobalConfig } from 'motion'
import { SleepAssessment } from '../../src/components/SleepAssessment'

MotionGlobalConfig.skipAnimations = true

afterEach(() => {
  cleanup()
})

// Shared helper: answer all 5 questions with first option each time
const answerAllQuestions = async (container: HTMLElement) => {
  for (let i = 0; i < 5; i++) {
    await waitFor(() => {
      expect(container.querySelector('[data-testid="option-0"]')).not.toBeNull()
    })
    fireEvent.click(container.querySelector('[data-testid="option-0"]')!)
  }
}

describe('SleepAssessment — Question Display (AC#2)', () => {
  it('should render the first question on initial display', () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    expect(container.textContent).toContain('你通常需要多久才能入睡')
  })

  it('should show progress indicator "1 / 5" for first question', () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    expect(container.textContent).toMatch(/1\s*\/\s*5/)
  })

  it('should show 4 option buttons for Q1', () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    const buttons = container.querySelectorAll('[data-testid^="option-"]')
    expect(buttons.length).toBe(4)
  })

  it('should show option labels in Traditional Chinese', () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    expect(container.textContent).toContain('不到 15 分鐘')
    expect(container.textContent).toContain('15-30 分鐘')
    expect(container.textContent).toContain('30-60 分鐘')
    expect(container.textContent).toContain('超過 60 分鐘')
  })
})

describe('SleepAssessment — Navigation (AC#2, AC#3)', () => {
  it('should auto-advance to Q2 after selecting an option on Q1', async () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    const firstOption = container.querySelector('[data-testid="option-0"]')
    fireEvent.click(firstOption!)

    await waitFor(() => {
      expect(container.textContent).toContain('你半夜會醒來幾次')
    })
    expect(container.textContent).toMatch(/2\s*\/\s*5/)
  })

  it('should NOT show back button on Q1', () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    expect(container.querySelector('[data-testid="back-btn"]')).toBeNull()
  })

  it('should show back button on Q2', async () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    const firstOption = container.querySelector('[data-testid="option-0"]')
    fireEvent.click(firstOption!)

    await waitFor(() => {
      expect(container.querySelector('[data-testid="back-btn"]')).not.toBeNull()
    })
  })

  it('should go back to Q1 when back button clicked on Q2, preserving answer', async () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)

    // Answer Q1
    const firstOption = container.querySelector('[data-testid="option-0"]')
    fireEvent.click(firstOption!)

    await waitFor(() => {
      expect(container.textContent).toContain('你半夜會醒來幾次')
    })

    // Go back
    const backBtn = container.querySelector('[data-testid="back-btn"]')
    fireEvent.click(backBtn!)

    await waitFor(() => {
      expect(container.textContent).toContain('你通常需要多久才能入睡')
    })

    // Previous answer should be preserved (selected style on option-0)
    const option0 = container.querySelector('[data-testid="option-0"]')
    expect(option0?.className).toContain('amber')
  })

  it('should navigate through all 5 questions', async () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)

    // Q1
    expect(container.textContent).toMatch(/1\s*\/\s*5/)
    fireEvent.click(container.querySelector('[data-testid="option-0"]')!)

    // Q2
    await waitFor(() => expect(container.textContent).toMatch(/2\s*\/\s*5/))
    fireEvent.click(container.querySelector('[data-testid="option-0"]')!)

    // Q3
    await waitFor(() => expect(container.textContent).toMatch(/3\s*\/\s*5/))
    fireEvent.click(container.querySelector('[data-testid="option-0"]')!)

    // Q4
    await waitFor(() => expect(container.textContent).toMatch(/4\s*\/\s*5/))
    fireEvent.click(container.querySelector('[data-testid="option-0"]')!)

    // Q5
    await waitFor(() => expect(container.textContent).toMatch(/5\s*\/\s*5/))
  })
})

describe('SleepAssessment — Result Screen (AC#6)', () => {
  it('should show result screen after answering all 5 questions', async () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    await answerAllQuestions(container)

    await waitFor(() => {
      expect(container.querySelector('[data-testid="sleep-result"]')).not.toBeNull()
    })
  })

  it('should display sleep type name on result', async () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    await answerAllQuestions(container)

    await waitFor(() => {
      const result = container.querySelector('[data-testid="sleep-result"]')
      expect(result).not.toBeNull()
      // Should display one of the three type names
      const text = result!.textContent ?? ''
      const hasTypeName =
        text.includes('入睡困難型') ||
        text.includes('淺眠易醒型') ||
        text.includes('焦慮思緒型')
      expect(hasTypeName).toBe(true)
    })
  })

  it('should display description on result', async () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    await answerAllQuestions(container)

    await waitFor(() => {
      const result = container.querySelector('[data-testid="sleep-result"]')
      expect(result).not.toBeNull()
      // result should have meaningful description text (more than just name)
      expect(result!.textContent!.length).toBeGreaterThan(20)
    })
  })

  it('should display "開始我的計畫" CTA button', async () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    await answerAllQuestions(container)

    await waitFor(() => {
      const cta = container.querySelector('[data-testid="start-plan-btn"]')
      expect(cta).not.toBeNull()
      expect(cta!.textContent).toContain('開始我的計畫')
    })
  })
})

describe('SleepAssessment — onComplete callback (AC#7)', () => {
  it('should call onComplete with calculated sleep type when CTA is clicked', async () => {
    const onComplete = vi.fn()
    const { container } = render(<SleepAssessment onComplete={onComplete} />)
    await answerAllQuestions(container)

    await waitFor(() => {
      expect(container.querySelector('[data-testid="start-plan-btn"]')).not.toBeNull()
    })

    fireEvent.click(container.querySelector('[data-testid="start-plan-btn"]')!)

    expect(onComplete).toHaveBeenCalledTimes(1)
    const calledType = onComplete.mock.calls[0][0]
    expect(['difficulty', 'light', 'anxious']).toContain(calledType)
  })
})

describe('SleepAssessment — Fullscreen & No TabBar (AC#1)', () => {
  it('should render as a fullscreen component', () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    const wrapper = container.querySelector('[data-testid="sleep-assessment"]')
    expect(wrapper).not.toBeNull()
    expect(wrapper!.className).toContain('min-h-screen')
  })
})

describe('SleepAssessment — Result Style (Task 3.4)', () => {
  it('should have centered layout on result screen', async () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    await answerAllQuestions(container)

    await waitFor(() => {
      const result = container.querySelector('[data-testid="sleep-result"]')
      expect(result).not.toBeNull()
      expect(result!.className).toContain('items-center')
      expect(result!.className).toContain('justify-center')
      expect(result!.className).toContain('text-center')
    })
  })

  it('should have dark theme on result screen', async () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    await answerAllQuestions(container)

    await waitFor(() => {
      const wrapper = container.querySelector('[data-testid="sleep-assessment"]')
      expect(wrapper!.className).toContain('bg-slate-900')
    })
  })

  it('should have amber accent on CTA button', async () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    await answerAllQuestions(container)

    await waitFor(() => {
      const cta = container.querySelector('[data-testid="start-plan-btn"]')
      expect(cta!.className).toContain('amber')
    })
  })

  it('should display type name in large text', async () => {
    const { container } = render(<SleepAssessment onComplete={vi.fn()} />)
    await answerAllQuestions(container)

    await waitFor(() => {
      const result = container.querySelector('[data-testid="sleep-result"]')
      const h1 = result!.querySelector('h1')
      expect(h1).not.toBeNull()
      expect(h1!.className).toContain('text-4xl')
    })
  })
})
