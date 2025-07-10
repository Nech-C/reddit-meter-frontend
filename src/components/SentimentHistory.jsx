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
import LoadingDots from './LoadingDots';

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

function normalizeSentiments(data) {
  const keys = ['joy', 'love', 'fear', 'anger', 'sadness', 'surprise'];
  const stats = {}

  for (const key of keys) {
    const values = data.map((d) => d[key]).filter((v) => typeof v === 'number');
    const total = values.reduce((sum, num) => sum + num, 0);
    const mean = total / values.length;
    const variance = values.reduce((sum, num) => sum + (num - mean) ** 2, 0) / values.length || 1;
    stats[key] = { mean, stdDev: Math.sqrt(variance) };
  }

  return data.map((record) => {
    const normalized = { ...record};

    for (const key of keys) {
      normalized[key]  = (record[key] - stats[key].mean) / stats[key].stdDev;
    }

    return normalized;
  })
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  // Sort descending by absolute value (or just value)
  const sortedPayload = [...payload].sort(
    (a, b) => b.value - a.value
  );

  return (
    <div className="bg-white p-3 border shadow rounded text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {sortedPayload.map((entry) => (
        <p
          key={entry.dataKey}
          style={{ color: entry.color, margin: 0 }}
        >
          {entry.dataKey} : {entry.value.toFixed(6)}
        </p>
      ))}
    </div>
  );
};


export default function SentimentHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataNormalized, setDataNormalized] = useState([]);
  const [showNormalized, setShowNormalized] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const json = await fetchSentimentHistory();
        const formatted = formatData(json || []);
        setData(formatted);
        setDataNormalized(normalizeSentiments(formatted));
      } catch (err) {
        console.error('Failed to fetch sentiment history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p className="text-gray-500"><LoadingDots /></p>;

  const currentData = showNormalized ? dataNormalized : data;

  return (
    <div className="shadow rounded-2xl p-6">
      <h2 className="text-3xl font-bold mb-4">Sentiment History</h2>
      <button
        className="shadow rounded-2xl px-4 py-1 bg-gray-200 hover:bg-gray-300 text-1xl"
        onClick={() => setShowNormalized((prev) => !prev)}
        >
          {showNormalized ? 'Show Raw Data' : 'Show Normalized Data'}
        </button>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={currentData} margin={{ top: 60, right: 30, left: 30, bottom: 40 }}>
          <CartesianGrid stroke="#eee" />
          <XAxis
            dataKey="timestamp"
            stroke="#ccc"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
          />
          <YAxis domain={[0, 1]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="joy" stroke={sentimentColors.joy} strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="love" stroke={sentimentColors.love} strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="fear" stroke={sentimentColors.fear} strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="anger" stroke={sentimentColors.anger} strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="sadness" stroke={sentimentColors.sadness} strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
