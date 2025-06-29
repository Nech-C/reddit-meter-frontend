import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { sentimentColors } from '../utils/sentimentColors';
import { fetchCurrentSentiment } from '../services/sentimentService';

export default function CurrentSentimentSummary() {
  const [data, setData] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchCurrentSentiment();
        setUpdatedAt(new Date(response.updatedAt));
        const chartData = Object.entries(response)
          .filter(([key]) => key !== 'updatedAt' && key !== 'timestamp')
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => a.value - b.value);

        setData(chartData);
      } catch (err) {
        console.error("Error fetching sentiment:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          🕒 Updated: {updatedAt.toLocaleString()}
        </p>
        <h2 className="text-xl font-semibold text-gray-800">Current Reddit Sentiment</h2>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={sentimentColors[entry.name] || "#ccc"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
