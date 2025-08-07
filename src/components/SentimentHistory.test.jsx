import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import SentimentHistory, { formatTimestamp, formatScore, formatData, normalizeSentiments } from './SentimentHistory'
import * as sentimentService from '../services/sentimentService'

const FIXTURES = {
  timestamps: [
    [1709182800000, 'Feb 29, 05:00'], // Thu Feb 29 2024 05:00:00 GMT+0000
    [1754509896000, 'Aug 06, 19:51'], // Wed Aug 06 2025 19:51:36 GMT+0000
    [1704085199000, 'Jan 01, 04:59'], // Mon Jan 01 2024 04:59:59 GMT+0000
  ],
  sentimentRecords: [
    [{
      timestamp: 1709182800000,
      joy: '0.5',
      anger: '0.3',
      sadness: '0.1',
      surprise: '0.05',
      love: '0.03',
      fear: '0.02',
    }, {
      timestamp: 1704085199000,
      joy: 0.5,
      anger: '0.3',
      sadness: 0.1,
      surprise: 3,
      love: '0.03',
      fear: '0.02',
    },
    ],

    [{
      timestamp: 'Feb 29, 05:00',
      joy: 0.5,
      anger: 0.3,
      sadness: 0.1,
      surprise: 0.05,
      love: 0.03,
      fear: 0.02,
    },
    {
      timestamp: 'Jan 01, 04:59',
      joy: 0.5,
      anger: 0.3,
      sadness: 0.1,
      surprise: 3,
      love: 0.03,
      fear: 0.02,
    }],
  ],
  sentimentRecordsForNorm: [
    {
      joy: 0.5,
      anger: 0.3,
      sadness: 0.1,
      surprise: 0.05,
      love: 0.03,
      fear: 0.0,
    },
    {
      joy: 0.6,
      anger: 0.3,
      sadness: 0.1,
      surprise: 3,
      love: 0.06,
      fear: 0.0,
    },
    {
      joy: 0.4,
      anger: 0.3,
      sadness: 0.2,
      surprise: 3,
      love: 0.09,
      fear: 0.0,
    }
  ]
}

describe('test helper functions', () => {
  test('formatTimestamp with valid input', () => {
    for (const [st, output] of FIXTURES.timestamps) {
      expect(formatTimestamp(st, 'UTC')).toBe(output)
    }
  })

  test('formatTimestamp with invalid input', () => {
    expect(formatTimestamp('3z387434', 'UTC')).toBe('Invalid Date')
  })

  test('formatScore', () => {
    expect(formatScore(3)).toBe(3)
    expect(formatScore('3')).toBe(3)
    expect(formatScore('z')).toBe(null)
  })

  test('formatData', () => {
    expect(formatData(FIXTURES.sentimentRecords[0], 'UTC')).toStrictEqual(FIXTURES.sentimentRecords[1])
  })

  test('normalizeSentiments', () => {
    const result = normalizeSentiments(FIXTURES.sentimentRecordsForNorm);

    expect(result).toHaveLength(3);

    for (const r of result) {
      for (const key of ['joy', 'love', 'fear', 'anger', 'sadness', 'surprise']) {
        expect(typeof r[key]).toBe('number');
        expect(Number.isNaN(r[key])).toBe(false);
      }
    }

    const joyValues = FIXTURES.sentimentRecordsForNorm.map(r => r.joy);
    const meanJoy = joyValues.reduce((sum, x) => sum + x, 0) / joyValues.length;
    const stdDevJoy = Math.sqrt(joyValues.reduce((sum, x) => sum + (x - meanJoy) ** 2, 0) / joyValues.length);
    const expectedJoy0 = (FIXTURES.sentimentRecordsForNorm[0].joy - meanJoy) / stdDevJoy;

    expect(result[0].joy).toBeCloseTo(expectedJoy0, 4);
  })
})

describe('test SentimentHistory', () => {
  test('renders loading state', async () => {
    vi.spyOn(sentimentService, 'fetchSentimentHistory').mockImplementation(() => new Promise(() => {}));

    render(<SentimentHistory />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  })

  test('', async () => {
    vi.spyOn(sentimentService, 'fetchSentimentHistory').mockResolvedValue([
      {
        timestamp: 1709182800000,
        joy: 0.5,
        anger: 0.3,
        sadness: 0.1,
        surprise: 0.05,
        love: 0.03,
        fear: 0.02,
      },
      {
        timestamp: 1704085199000,
        joy: 0.6,
        anger: 0.25,
        sadness: 0.15,
        surprise: 0.1,
        love: 0.05,
        fear: 0.03,
      }
    ])

    render(<SentimentHistory />);
    await waitFor(() => {
      expect(screen.getByText('Sentiment History')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /raw data/i })).toBeInTheDocument()
    })
  })
})
