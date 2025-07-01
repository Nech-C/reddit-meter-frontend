import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { sentimentColors } from '../utils/sentimentColors';
import { fetchSentimentHistory } from '../services/sentimentService';

function formatTimestamp(timestamp, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return date.toLocaleString('en-US', {
    timeZone,
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: true,
  });
}

function formatScore(value) {
  const num = typeof value === 'number' ? value : parseFloat(value);
  return Number.isNaN(num) ? null : parseFloat(num.toFixed(4));
}

function formatData(records) {
  return records.map((record) => ({
    timestamp: formatTimestamp(record.timestamp),
    joy: formatScore(record.joy),
    love: formatScore(record.love),
    fear: formatScore(record.fear),
    anger: formatScore(record.anger),
    sadness: formatScore(record.sadness),
    surprise: formatScore(record.surprise),
  }));
}

export default function SentimentHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const json = await fetchSentimentHistory();
        const formatted = formatData(json || []);
        setData(formatted);
      } catch (err) {
        console.error('Failed to fetch sentiment history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="shadow rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4">Sentiment History</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data} margin={{ top: 60, right: 30, left: 30, bottom: 40 }}>
          <CartesianGrid stroke="#eee" />
          <XAxis
            dataKey="timestamp"
            stroke="#ccc"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
          />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line dataKey="joy" stroke={sentimentColors.joy} strokeWidth={3} dot={false} />
          <Line dataKey="love" stroke={sentimentColors.love} strokeWidth={3} dot={false} />
          <Line dataKey="fear" stroke={sentimentColors.fear} strokeWidth={3} dot={false} />
          <Line dataKey="anger" stroke={sentimentColors.anger} strokeWidth={3} dot={false} />
          <Line dataKey="sadness" stroke={sentimentColors.sadness} strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
