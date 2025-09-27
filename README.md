# CampShare

A modern social media platform for camping and outdoor adventures, built with Next.js and ready for Vercel deployment.

## 🏕️ About

CampShare connects outdoor enthusiasts to share their camping experiences, discover new spots, and build a community around wilderness adventures.

## ✨ Features

- **Share Adventures**: Upload photos and write about your camping trips
- **Discover Locations**: Find hidden gems and popular camping destinations
- **Connect with Others**: Follow fellow adventurers and build community
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern Tech Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd jurni
```

2. **Install dependencies:**
```bash
cd web
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
jurni/
├── web/                    # Next.js web application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable React components
│   │   └── lib/          # Utility functions
│   ├── public/           # Static assets
│   ├── package.json      # Dependencies and scripts
│   └── README.md         # Web app documentation
├── .gitignore            # Git ignore rules
├── LICENSE               # MIT License
└── README.md             # This file
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Deployment**: Vercel Ready

## 🚀 Deployment

This app is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔧 Environment Variables

Create a `.env.local` file in the `web/` directory:

```bash
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
UPLOADCARE_PUBLIC_KEY=your-uploadcare-key
GOOGLE_MAPS_API_KEY=your-google-maps-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the outdoor community
- Inspired by the beauty of nature and adventure
