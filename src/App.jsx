import './index.css'
import SentimentSummary from './components/SentimentSummary'
function App() {
  

  return (
    <div className='border-2'>
      <span className='border-2 border-amber-700'>Reddit Meter</span>
      <span className='border-2 border-blue-700'>
        1
        {/* <SentimentSummary
          data={{
            joy: 0.8,
            sadness: 0.1,
            anger: 0.05,
            fear: 0.02,
            love: 0.03,
            surprise: 0.01
          }}
      /> */}
      </span>
      
    </div>
  )
}

export default App
