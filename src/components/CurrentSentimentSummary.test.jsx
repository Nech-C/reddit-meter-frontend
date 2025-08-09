import { describe, test, expect, vi } from 'vitest'
import CurrentSentimentSummary from './CurrentSentimentSummary'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import * as service from '../services/sentimentService'

describe('test CurrentSentimentSummary', () => {
  test('renders loading state', () => {
    vi.spyOn(service, 'fetchCurrentSentiment').mockImplementation(() => new Promise(() => {}))
    render(<CurrentSentimentSummary />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('renders current sentiment', () => {
    vi.spyOn(service, 'fetchCurrentSentiment').mockResolvedValue({
      joy: 0.4,
      sadness: 0.4,
      anger: 0.1,
      fear: 0.5,
      love: 0.4,
      surprise: 0.1,
    })

    render(<CurrentSentimentSummary />)
    waitFor(() => {
      expect(screen.getByText(/Current Reddit Sentiment/i)).toBeInTheDocument()
    })
  })
})
