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

import { sentimentColors } from '../utils/sentimentColors'; // Make sure this path is correct
import { fetchSentimentHistory } from '../services/sentimentService';
import LoadingDots from './LoadingDots'; // Assuming this provides a nice loading animation

/**
 * Formats a timestamp into a localized string.
 * @param {string | number | Date} timestamp - The timestamp to format.
 * @param {string} timeZone - The IANA time zone name (e.g., 'America/New_York').
 * @returns {string} The formatted date string.
 */
function formatTimestamp(timestamp, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Invalid Date';

  // Use a more compact format for chart labels
  return date.toLocaleString('en-US', {
    timeZone,
    month: 'short', // e.g., 'Jul'
    day: '2-digit', // e.g., '26'
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format for consistency on axis
  });
}

/**
 * Formats a numerical score to a fixed number of decimal places.
 * @param {number | string} value - The score to format.
 * @returns {number | null} The formatted score or null if invalid.
 */
function formatScore(value) {
  const num = typeof value === 'number' ? value : parseFloat(value);
  return Number.isNaN(num) ? null : parseFloat(num.toFixed(4));
}

/**
 * Formats raw sentiment records for chart display.
 * @param {Array<Object>} records - Array of raw sentiment records.
 * @returns {Array<Object>} Formatted data for the chart.
 */
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

/**
 * Normalizes sentiment scores using Z-score normalization.
 * @param {Array<Object>} data - Array of formatted sentiment data.
 * @returns {Array<Object>} Normalized sentiment data.
 */
function normalizeSentiments(data) {
  const keys = ['joy', 'love', 'fear', 'anger', 'sadness', 'surprise'];
  const stats = {};

  // Calculate mean and standard deviation for each sentiment
  for (const key of keys) {
    const values = data.map((d) => d[key]).filter((v) => typeof v === 'number' && !isNaN(v));
    if (values.length === 0) {
      stats[key] = { mean: 0, stdDev: 1 }; // Avoid division by zero
      continue;
    }
    const total = values.reduce((sum, num) => sum + num, 0);
    const mean = total / values.length;
    const variance = values.reduce((sum, num) => sum + (num - mean) ** 2, 0) / values.length;
    stats[key] = { mean, stdDev: Math.sqrt(variance) || 1 }; // stdDev of 0 would cause NaN
  }

  // Apply Z-score normalization
  return data.map((record) => {
    const normalized = { ...record};

    for (const key of keys) {
      if (typeof record[key] === 'number' && !isNaN(record[key])) {
        normalized[key] = (record[key] - stats[key].mean) / stats[key].stdDev;
      } else {
        normalized[key] = null; // Keep null if original value was not a number
      }
    }
    return normalized;
  });
}

/**
 * Custom Tooltip component for the LineChart.
 * Displays sentiment values sorted by magnitude.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  // Filter out null or undefined values and sort by absolute value descending
  const sortedPayload = payload
    .filter(entry => typeof entry.value === 'number' && !isNaN(entry.value))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  if (sortedPayload.length === 0) return null; // Don't show tooltip if no valid data

  return (
    <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg text-sm transition-opacity duration-300">
      <p className="font-bold text-gray-800 mb-2">{label}</p>
      {sortedPayload.map((entry) => (
        <p
          key={entry.dataKey}
          style={{ color: entry.color }}
          className="mb-1 last:mb-0"
        >
          <span className="font-semibold capitalize">{entry.name}:</span>{' '}
          <span className="font-mono">{entry.value.toFixed(4)}</span>
        </p>
      ))}
    </div>
  );
};

export default function SentimentHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataNormalized, setDataNormalized] = useState([]);
  const [showNormalized, setShowNormalized] = useState(true); // Default to normalized view

  useEffect(() => {
    async function fetchData() {
      try {
        const json = await fetchSentimentHistory();
        const formatted = formatData(json || []);
        setData(formatted);
        
        // Ensure normalization only happens if there's valid data
        if (formatted.length > 0) {
          setDataNormalized(normalizeSentiments(formatted));
        } else {
          setDataNormalized([]);
        }
      } catch (err) {
        console.error('Failed to fetch sentiment history:', err);
        // Implement user-facing error message here
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-white rounded-xl shadow-lg">
        <LoadingDots />
        <p className="ml-3 text-lg text-gray-600">Loading sentiment history...</p>
      </div>
    );
  }

  const currentData = showNormalized ? dataNormalized : data;
  const hasData = currentData && currentData.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 flex flex-col h-full">
      <header className="mb-6 pb-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">Sentiment History</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          onClick={() => setShowNormalized((prev) => !prev)}
        >
          {showNormalized ? 'Show Raw Data' : 'Show Normalized Data'}
        </button>
      </header>

      {!hasData ? (
        <div className="flex flex-grow justify-center items-center text-gray-500 text-xl py-10">
          <p>No historical sentiment data available to display.</p>
        </div>
      ) : (
        <div className="flex-grow w-full h-[500px]"> {/* Explicit height for ResponsiveContainer parent */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="timestamp"
                stroke="#666"
                tick={{ fontSize: 11, fill: '#555' }}
                angle={-45}
                textAnchor="end"
                height={60} // Give more space for tilted labels
                interval="preserveStartEnd" // Helps prevent overlapping labels
              />
              <YAxis
                stroke="#666"
                tick={{ fontSize: 11, fill: '#555' }}
                domain={showNormalized ? ['auto', 'auto'] : [0, 1]} // Auto domain for normalized, 0-1 for raw
                label={{ 
                    value: showNormalized ? 'Z-Score' : 'Sentiment Score', 
                    angle: -90, 
                    position: 'insideLeft', 
                    fill: '#555', 
                    fontSize: 14 
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                height={40} // Adjust height to prevent overlap with chart
                wrapperStyle={{ paddingBottom: '10px' }}
                iconType="line"
              />
              {/* Lines for each sentiment */}
              <Line type="monotone" dataKey="joy" stroke={sentimentColors.joy} strokeWidth={2.5} dot={false} name="Joy" />
              <Line type="monotone" dataKey="love" stroke={sentimentColors.love} strokeWidth={2.5} dot={false} name="Love" />
              <Line type="monotone" dataKey="fear" stroke={sentimentColors.fear} strokeWidth={2.5} dot={false} name="Fear" />
              <Line type="monotone" dataKey="anger" stroke={sentimentColors.anger} strokeWidth={2.5} dot={false} name="Anger" />
              <Line type="monotone" dataKey="sadness" stroke={sentimentColors.sadness} strokeWidth={2.5} dot={false} name="Sadness" />
              <Line type="monotone" dataKey="surprise" stroke={sentimentColors.surprise} strokeWidth={2.5} dot={false} name="Surprise" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}