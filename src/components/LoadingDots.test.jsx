import { render, act } from '@testing-library/react'
import LoadingDots from './LoadingDots'
import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest'
import React from 'react'

describe('LoadingDots', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  test('cycles dots via container', () => {
    vi.useFakeTimers()
    const { container } = render(<LoadingDots />)
    const wrapper = container.firstChild // that's the <div>

    act(() => vi.advanceTimersByTime(500))
    expect(wrapper.textContent).toBe('Loading..')

    act(() => vi.advanceTimersByTime(500))
    expect(wrapper.textContent).toBe('Loading...')

    act(() => vi.advanceTimersByTime(500))
    expect(wrapper.textContent).toBe('Loading.')
  })
})
