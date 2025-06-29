const BASE_URL = "https://reddit-api-547471370046.us-central1.run.app";

export async function fetchCurrentSentiment() {
  const res = await fetch(`${BASE_URL}/sentiment/current`);
  if (!res.ok) {
    throw new Error("Failed to fetch sentiment data");
  }
  return await res.json();
}
