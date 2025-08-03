// file: src/services/sentimentService.js

const BASE_URL = import.meta.env.VITE_SENTIMENT_API_URL

export async function fetchCurrentSentiment() {
  const res = await fetch(`${BASE_URL}/sentiment/current`)
  if (!res.ok) {
    throw new Error('Failed to fetch sentiment data')
  }
  return await res.json()
}

export async function fetchSentimentHistory() {
  const res = await fetch(`${BASE_URL}/sentiment/week`)
  if (!res.ok) {
    throw new Error('Failed to fetch sentiment history')
  }
  return await res.json()
}
