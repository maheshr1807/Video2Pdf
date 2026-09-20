# Video2PDF AI

**Multilingual AI-Powered YouTube Tutorial to Structured PDF Learning System**

Convert any YouTube tutorial into a professional, structured PDF study document using Google Gemini AI.

## Features

- 🎥 **YouTube Transcript Extraction** — Fetches captions from any YouTube video
- 🤖 **AI-Powered Analysis** — Gemini AI detects chapters, generates summaries, key points, and examples
- 🌍 **Multilingual** — Output in 15+ languages (English, Tamil, Hindi, Arabic, Japanese, etc.)
- 📄 **Professional PDF** — Cover page, TOC, styled chapters, code blocks, interview questions, and MCQ quiz
- ⚡ **Real-time Progress** — Animated step-by-step progress tracker

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| AI | Google Gemini Flash |
| Transcript | youtube-transcript npm package |
| PDF | PDFKit |

## Setup

### Prerequisites
- Node.js 18+
- A Google Gemini API key (free at [makersuite.google.com](https://makersuite.google.com/app/apikey))

### Backend

```bash
cd backend
cp .env .env.local     # Edit and add your GEMINI_API_KEY
npm install
npm run dev            # Starts on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # Starts on port 5173
```

Open http://localhost:5173

## Usage

1. Paste a YouTube URL into the input field
2. Click **Analyze** — video title and thumbnail will appear
3. Click **Configure & Generate PDF**
4. Select your output language and PDF content options
5. Click **Generate PDF** and watch the progress
6. Download or preview your professional study PDF

## Project Structure

```
video2pdf-ai/
├── frontend/              React + Vite + Tailwind
│   └── src/
│       ├── components/    Navbar, UrlInput, ProgressTracker, ChapterCard, ...
│       ├── pages/         Home, Generate, Processing, Result
│       └── services/      api.js, videoService.js, pdfService.js
├── backend/               Node.js + Express
│   ├── services/          youtubeService, transcriptService, aiService, pdfService
│   ├── routes/            video, transcript, ai, pdf routes
│   └── middleware/        error handler, rate limiter
└── generated/pdfs/        Generated PDF output directory
```

## Environment Variables (backend/.env)

```env
PORT=5000
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-flash-latest
MAX_VIDEO_LENGTH_MINUTES=90
```

## Deployment (Production)

This app is configured for a **unified single-server deployment**. The Express backend serves both the API and the compiled React frontend static files.

### 1. Build the App
From the root directory, install all dependencies and build the frontend:
```bash
npm install          # Automatically installs frontend and backend dependencies
npm run build        # Compiles the React frontend to frontend/dist/
```

### 2. Run in Production
Start the backend server in production mode:
```bash
export NODE_ENV=production
export GEMINI_API_KEY=your_production_key
npm start
```
The app will be available at `http://localhost:5000` (or whatever `PORT` is assigned by your host).

### 3. Deploying to Cloud Providers (Render, Heroku, Railway)
You can easily deploy this repository to most cloud providers by specifying these settings:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**: Add `GEMINI_API_KEY` and set `NODE_ENV=production`.

## Notes

- Works with YouTube videos that have **auto-generated or manual captions**
- Videos without captions will show an error with a helpful message
- Free Gemini API has rate limits — processing may take 2-5 minutes
- For educational use only
