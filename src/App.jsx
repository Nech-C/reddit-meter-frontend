import './index.css'
import SentimentSummary from './components/SentimentSummary'
function App() {
  

  return (
    <div className='flex flex-col h-screen'>
      <h1 className='text-center mb-20 text-7xl'>Reddit Meter</h1>
      <div className='border-blue-700'>
        
        <h2 className='text-4xl mb-5'>Today's Reddit Sentiment:</h2>
        <SentimentSummary
          data={{
            joy: 0.8,
            sadness: 0.1,
            anger: 0.05,
            fear: 0.02,
            love: 0.03,
            surprise: 0.01
          }}
      />
      </div>
      
    </div>
  )
}

export default App
