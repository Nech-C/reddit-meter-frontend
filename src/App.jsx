// File: src/App.jsx
import './index.css'
import CurrentSentimentSummary from './components/CurrentSentimentSummary'

function App() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-52 bg-white shadow-md py-6 px-5">
        <h1 className="text-2xl font-bold text-amber-700">Reddit Meter</h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 py-10 overflow-y-auto">
        <CurrentSentimentSummary />
      </main>
    </div>
  );
}

export default App;
