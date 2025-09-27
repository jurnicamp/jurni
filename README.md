# CampShare Web App

A modern Next.js web application for sharing camping and outdoor adventure stories.

## Features

- 🏕️ **Share Adventures**: Upload photos and stories about your camping trips
- 🗺️ **Discover Locations**: Find new camping spots shared by the community
- 👥 **Connect**: Follow fellow outdoor enthusiasts
- 📱 **Responsive**: Works perfectly on desktop and mobile
- ⚡ **Fast**: Built with Next.js 14 and optimized for performance

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update environment variables in `.env.local`

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

This app is ready for deployment on Vercel:

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

## Project Structure

```
web/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable React components
│   └── lib/          # Utility functions
├── public/           # Static assets
├── package.json      # Dependencies and scripts
├── tailwind.config.js # Tailwind configuration
├── tsconfig.json     # TypeScript configuration
└── next.config.js    # Next.js configuration
```

## Environment Variables

Create a `.env.local` file with:

```bash
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
UPLOADCARE_PUBLIC_KEY=your-uploadcare-key
GOOGLE_MAPS_API_KEY=your-google-maps-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
