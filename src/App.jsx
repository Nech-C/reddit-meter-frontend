// File: src/App.jsx
import './index.css';
import CurrentSentimentSummary from './components/CurrentSentimentSummary';
import SentimentHistory from './components/SentimentHistory';

function App() {
  return (
    <div className="flex flex-col lg:flex-row bg-gradient-to-br from-blue-300 to-indigo-400">
      {/* Sidebar */}
      <aside className="w-full lg:w-68 bg-gradient-to-r from-gray-50 to-indigo-50 shadow-2xl py-7 px-4 flex flex-col items-center lg:items-start z-10">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-amber-700 mb-2 tracking-wide">
            Reddit Meter
          </h1>
          <p className="text-sm text-gray-700">Track Reddit's collective mood, in real-time.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-10 min-h-screen">
        <section className="animate-fade-in-up ">
          <CurrentSentimentSummary />
        </section>
        <div className="flex justify-center items-center">
            <hr className="w-full max-w-2xl border-t-2 border-gray-300 opacity-70" />
            <span className="absolute px-4 text-gray-500 font-semibold text-sm">
                History
            </span>
        </div>
        <section className="animate-fade-in-up delay-400">
          <SentimentHistory />
        </section>
      </main>
    </div>
  );
}

export default App;
