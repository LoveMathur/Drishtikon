# Drishtikon Frontend

React + Vite + Tailwind CSS frontend inspired by Ground News, with an animated hero landing page.

## 🎨 Design Features

### Landing Page (Animated Hero)
- Beautiful gradient animations
- Floating background elements
- Glass-morphism effects
- Smooth scroll indicators
- Feature cards with hover effects
- Stats showcase

### Main Content Page
- **Color Coding by Bias:**
  - 🔴 **RED**: Right-leaning sources
  - ⚪ **WHITE**: Center/Neutral sources  
  - 🔵 **BLUE**: Left-leaning sources

- **Trending Categories:**
  - India & Geopolitics
  - War Room
  - Inside Parliament
  - Celebs Corner

- **Footer Sections:**
  - Trending in Borders (Indian neighboring countries)
  - Trending Internationally (All continents)
  - Trending in Reels (Popular topics)

## 🚀 Running the Frontend

### Prerequisites
- Node.js 20+ installed
- Backend API running on port 8001

### Start Development Server

```bash
cd frontend
npm run dev
```

The app will be available at: **http://localhost:5173/**

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AnimatedHero.jsx    # Landing page with animations
│   │   ├── MainContent.jsx     # Main news analysis page
│   │   ├── Footer.jsx          # Footer with trending sections
│   │   └── NewsCard.jsx        # News article card component
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Tailwind + custom styles
│   └── main.jsx                # Entry point
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies
```

## 🎨 Color Palette

```css
--bias-left: #3B82F6       /* Blue */
--bias-center: #F5F5F5     /* White/Light Gray */
--bias-right: #EF4444      /* Red */
--gradient: orange → red → pink
--background: black → gray-950
```

## ✨ Key Features

### 1. Animated Landing Page
- Hero section with gradient background
- Animated floating elements
- Feature cards
- Real-time stats display
- Smooth CTA button

### 2. News Analysis Interface
- Topic search functionality
- Real-time consensus analysis
- Bias-colored article cards
- Consensus vs Disagreement visualization

### 3. Trending Sections
- Category-based trending stories
- Consensus level indicators
- Source count display
- Interactive hover effects

### 4. Comprehensive Footer
- Geographic trending (borders)
- Global trending (continents)
- Content trending (reels)
- Links and copyright info

## 🔌 API Integration

The frontend connects to the FastAPI backend at `http://localhost:8001/api/analyze`

---

**Status**: ✅ Complete  
**Version**: 1.0  
**Last Updated**: 2026-04-07
