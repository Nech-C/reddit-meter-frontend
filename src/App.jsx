// File: src/App.jsx
import './index.css';
import CurrentSentimentSummary from './components/CurrentSentimentSummary';
import SentimentHistory from './components/SentimentHistory';

function App() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-56 bg-white shadow-md py-6 px-5">
        <h1 className="text-2xl font-bold text-amber-700 mb-4">Reddit Meter</h1>
        <p className="text-sm text-gray-600">Track Reddit's mood in real time.</p>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 py-4 md:py-8 overflow-y-auto space-y-12">
        <section>
          <CurrentSentimentSummary />
        </section>
        <hr className="my-6 border-gray-300" />
        <section>
          <SentimentHistory />
        </section>
      </main>
    </div>
  );
}

export default App;
