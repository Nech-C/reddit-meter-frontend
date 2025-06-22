import react from 'react';
import { sentimentColors } from '../utils/sentimentColors';

export default function SentimentSummary({ data }) {
  return (
    <div>
      {Object.entries(data).map(([label, score]) => (
        <div key={label}>
          <div>sentiment: {label}</div>
          <div>level: {score}</div>
        </div>
      ))}
    </div>
  )
}