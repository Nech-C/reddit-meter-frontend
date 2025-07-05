import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { sentimentColors, sentiments } from '../utils/constants'
import { fetchCurrentSentiment } from '../services/sentimentService';


export default function CurrentSentimentSummary() {
  const [data, setData] = useState([]);
  const [sentimentContributors, setSentimentContributors] = useState({})
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSentiment, setSelectedSentiment] = useState("joy")

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchCurrentSentiment();
        // store timestamp
        setUpdatedAt(new Date(response.updatedAt));
        
        // store top contributors
        setSentimentContributors(response._top_contributor)
        const chartData = Object.entries(response)
          .filter(([key]) => sentiments.includes(key))
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
    <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[520px] p-6">
      <div className="w-full md:w-[500px] bg-white p-6 rounded-lg shadow h-auto md:h-full">
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            🕒 Updated: {updatedAt.toLocaleString()}
          </p>
          <h2 className="text-3xl font-semibold text-gray-800">Current Reddit Sentiment</h2>
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
                onClick={(data, index) => {
                  setSelectedSentiment(data.name);
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={sentimentColors[entry.name] || "#ccc"} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        
      </div> {/* end of pie chart div*/}
      

      <div className="w-full md:w-[600px] bg-white p-6 rounded-2xl shadow overflow-y-auto h-auto md:h-full">
        <h3 className="mb-8">
          {selectedSentiment}
        </h3>
        <ol className='space-y-4'>
          {
            sentimentContributors[selectedSentiment]
              .sort((a, b) => a.score - b.score)
              .map((post) => {
                return (
                  <li className="mb-5">
                    <a
                      href={post['url']}
                      target="_blank"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                        {post['title'] || "[No title]"}
                    </a>
                    <p
                      className = "text-sm text-gray-600 mt-1"
                    >
                      {post['text'] ? post.text.slice(0, 200) + (post.length > 200 ? "..." : "") : ["No text"]}
                    </p>

                    <p>
                      Score: {post['score'].toLocaleString()} | Comments: {post['num_comments']}
                    </p>

                  </li>
                  
                )
              })
          }

        </ol>
      </div>
    </div>
  );
}
