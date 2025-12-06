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

## Pirate Level Scoring

Based on research about instant ramen sodium content:
- **0 skulls**: <800mg (very healthy)
- **1 skull**: 800-1500mg (below average, meets AHA recommendation)
- **2 skulls**: 1500-2000mg (average ramen, WHO limit)
- **3 skulls**: 2000-2500mg (exceeds WHO limit, near FDA limit)
- **4 skulls**: 2500-3500mg (significantly exceeds FDA limit)
- **5 skulls**: >3500mg (extreme/dangerous)

### Research Sources
- [Healthline: Are Instant Ramen Noodles Bad for You?](https://www.healthline.com/nutrition/ramen-noodles)
- [Negi and Nori: Sodium in Ramen Breakdown](https://negiandnori.com/blogs/sodium-in-ramen/)
- [NIH Study: Sodium Content of Instant Noodles](https://pmc.ncbi.nlm.nih.gov/articles/PMC5490591/)

---

Made with ❤️ and instant noodles
