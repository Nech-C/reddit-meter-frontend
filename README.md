# Reddit Sentiment Meter

A React application that visualizes the community mood on Reddit. It fetches sentiment scores from a backend service and displays both a real-time summary and a history chart for the past week.

## Features

- **Real‑time sentiment** – view the overall distribution of joy, sadness, anger, fear, love and surprise in a pie chart.
- **Top posts** – inspect the highest scoring posts contributing to each sentiment.
- **Historical trends** – toggle between raw and normalized data to explore how sentiment changes over time.
- **Modern stack** – built with React, Vite and Tailwind CSS. Charts are rendered using Recharts.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` by default.

3. Build for production:

   ```bash
   npm run build
   ```
   
   To preview the production build locally run:
   
   ```bash
   npm run preview
   ```

This project relies on an external API for sentiment data. The API base URL is configured in `src/services/sentimentService.js`.

## Project Structure

```
src/
├── components/    # reusable UI components
├── services/      # API calls
├── utils/         # constants and helpers
└── App.jsx        # application layout
```

## License

This project is open source and available under the [MIT license](LICENSE) unless noted otherwise.
