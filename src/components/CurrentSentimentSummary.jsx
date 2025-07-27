import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

import { sentimentColors, sentiments } from '../utils/constants';
import { fetchCurrentSentiment } from '../services/sentimentService';
import LoadingDots from './LoadingDots';

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

  if (loading) return <p className="text-gray-500"><LoadingDots /></p>;

  return (
    <div className="min-h-3/4 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8
             items-start lg:items-stretch">
        <section className="h-[42rem] bg-white rounded-lg shadow-2xl p-6 flex flex-col
                            transform hover:scale-110 transition-transform duration-300 ease-in-out">
          <header className="mb-4 border-b border-gray-200 pb-2">
            <p className="text-sm text-gray-600 flex items-center mb-1">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 animate-pulse mr-2"></span> 
                Updated: {updatedAt? updatedAt.toLocaleString() : "N/A"}
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Current Reddit Sentiment
            </h2>
            <p className="text-gray-600 mt-1">An overview of emotional tones from recent Reddit posts.</p>
          </header>

          <div className="w-full flex-grow h-auto">
            <ResponsiveContainer width="100%" height={388}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={3}
                  cornerRadius={7}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  onClick={(data) => {
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
          
          
        </section> {/* end of pie chart div*/}
        
        {/* top posts for each sentiment */}
        <section className="h-[42rem] bg-white rounded-lg shadow-2xl p-6 flex flex-col
                            transform hover:scale-110 transition-transform duration-300 ease-in-out">
          <header className="mb-4 border-b border-gray-200 pb-2">
            <h3 className="text-3xl font-extrabold text-gray-900 capitalize mb-1">
              Top {selectedSentiment} Contributors
            </h3>
            <p className="text-gray-600">Discover posts driving the current {selectedSentiment} sentiment.</p>
          </header>
          <div className="flex-grow overflow-y-auto pr-2 -mr-2">
            <ol className='space-y-4'>
              {
                sentimentContributors[selectedSentiment]
                  .sort((a, b) => b.score - a.score)
                  .map((post) => {
                    return (
                      <li
                        className="bg-gray-50 border border-gray-200 rounded-lg shadow-lg p-3 hover:shadow-lg transition-shadow duration-200 ease-in-out"
                        key={post["id"]}>
                        <p className="text-sm text-gray-500 mb-1 flex items-center">
                          <span className="text-blue-500 mr-1">#</span> 
                          r/{post.subreddit}
                        </p>
                        <a
                          href={post['url']}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-lg font-bold text-blue-700 hover:text-blue-800 hover:underline mb-2 transition-colors duration-200"
                        >
                            {post['title'] || "[No title]"}
                        </a>
                        {post.text && (
                        <p className="text-base text-gray-800 mb-2 line-clamp-3">
                          {post.text.length > 200 ? `${post.text.slice(0, 200)}...` : post.text}
                        </p>
                      )}

                        <p className='text-xs text-gray-500 mb-1'>
                          Score: {post['score'].toLocaleString()} | Comments: {post['num_comments']}
                        </p>
                        {post.comments?.[0]?.body && (
                          <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded-r-md">
                            <p className="text-sm italic text-gray-700">
                              <strong className="font-semibold text-blue-600">Top Comment:</strong>{" "}
                              {post.comments[0].body.length > 150 
                                ? `${post.comments[0].body.slice(0, 150)}...` 
                                : post.comments[0].body}
                            </p>
                          </div>
                      )}
                      </li>
                      
                    )
                  })
              }

            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
