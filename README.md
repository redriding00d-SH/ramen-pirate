# 🍜 Ramen Pirate

A mobile-friendly web app that scans ramen nutrition labels and provides AI-powered health insights.

## Features

- 📸 Camera-based nutrition label scanning
- 🤖 AI-powered analysis using OpenAI Vision API
- 📊 Instant nutrition information display
- ⚠️ Health warnings and cautionary summaries
- 🏴‍☠️ Fun "Pirate Level" rating system
- 📱 Mobile-first responsive design

## Tech Stack

- **Frontend**: Vanilla JavaScript + HTML + CSS
- **Build Tool**: Vite
- **AI/OCR**: OpenAI Vision API
- **Deployment**: Vercel (with serverless functions)

## Project Structure

```
ramen-pirate/
├── index.html          # Main HTML file
├── style.css           # Styling
├── main.js             # Client-side JavaScript
├── package.json        # Dependencies
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key (get one at https://platform.openai.com)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ramen-pirate
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Setting Up the API

The app requires a backend API endpoint to securely call OpenAI Vision API. You'll need to:

1. Create a serverless function (Next steps in development)
2. Add your OpenAI API key as an environment variable
3. Update the `API_ENDPOINT` in `main.js`

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

This app is designed to be deployed on Vercel with serverless functions.

Deployment guide coming soon!

## How It Works

1. User clicks "scan your ramen" button
2. Camera opens or file picker appears
3. User takes/selects photo of nutrition label
4. Image is sent to OpenAI Vision API
5. AI extracts nutrition info and generates summary
6. Results are displayed with health insights

## Roadmap

- [ ] Set up Vercel serverless function for API calls
- [ ] Implement OpenAI Vision API integration
- [ ] Add error handling and validation
- [ ] Implement pirate level calculation algorithm
- [ ] Add scan history feature
- [ ] Support multiple languages
- [ ] PWA functionality for offline use

## License

MIT

## Contributing

This is a learning project. Feel free to fork and experiment!

---

Made with ❤️ and 🍜
