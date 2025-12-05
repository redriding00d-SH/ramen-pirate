# 🍜 Ramen Pirate

Scan ramen nutrition labels and get AI-powered health insights with a pirate rating system.

## Features

- 📱 Tap barcode to scan nutrition labels
- 🏴‍☠️ Get a pirate level rating (0-5 skulls)
- 🤖 AI explains additives and health concerns
- 📊 See sodium, allergens, additives, spice level

## Tech Stack

- Vanilla JS + Vite
- OpenAI Vision API (gpt-4o)
- Vercel serverless functions

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## Deploy to Vercel

```bash
vercel
```

### Environment Variables (set in Vercel):

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `MAX_SCANS` - Optional scan limit (e.g., 50)

---

Made with ❤️ and instant noodles
