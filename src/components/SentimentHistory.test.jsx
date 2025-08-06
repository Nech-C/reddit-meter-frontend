import { describe, test, expect } from 'vitest'

import { formatTimestamp, formatScore, formatData } from './SentimentHistory'

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
})
