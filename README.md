# Progress Pulse • Pro

A high-performance, neobrutalist personal progress tracker built with **React**, **Vite**, and **Tailwind CSS**. Designed for discipline, streak tracking, interactive whiteboard ideation, daily logs, and visual Kanban management.

## ✨ Features

- **⚡ Neobrutalist Aesthetic**: High-contrast borders, bold typography, tactile drop shadows, and an ultra-clean Light & Dark Brutal theme.
- **🎯 Custom Daily Goals**: Add, track, and complete your own personalized daily routines across Coding, DSA, College, Video Editing, Fitness, and more.
- **🔥 Streaks & Milestones**: Real-time streak tracking, active day logs, completion metrics, and achievement badges.
- **📋 Visual Kanban Board**: Organize tasks across Backlog, In Progress, Review, and Done with drag-and-drop intuition and domain tags.
- **📖 Daily Journal & Hours Logger**: Log time invested per domain and capture daily reflections with tag filters.
- **🎨 Interactive Idea Canvas**: Built-in whiteboard for drafting algorithm trees, system diagrams, and storyboard notes.
- **📱 Mobile PWA & Offline Support**: Fully installable Progressive Web App with standalone full-screen view, offline service worker caching, and touch-optimized mobile navigation.
- **💾 Local-First Persistence**: Instant offline storage via `localStorage` with JSON export and restore capabilities.

## 📱 Mobile App (PWA) Installation

Your app can be installed directly onto any smartphone without an app store:

### 🤖 On Android (Chrome / Brave / Edge)
1. Open the deployed website link.
2. Tap the **"INSTALL"** banner or open the browser menu (`⋮`) and tap **"Install app"** (or **"Add to Home Screen"**).
3. The app will install with its own icon and launch full-screen.

### 🍎 On iPhone / iPad (Safari)
1. Open the website link in **Safari**.
2. Tap the **Share button** (the square with an arrow pointing up).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **"Add"** in the top right corner.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/umesh-dev31/self-progress.git

# Navigate into project directory
cd self-progress

# Install dependencies
npm install

# Start local development server
npm run dev
```

The app will be running at `http://localhost:3000` (or the port indicated in your terminal).

### Build for Production

```bash
npm run build
```

This generates optimized static files in `dist/` along with service worker `sw.js` and `manifest.webmanifest`.

### 🌐 Share with Friends (Free 1-Click Hosting)
Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com):
```bash
# Deploy with Vercel CLI
npx vercel

# Or push your repo to GitHub and connect it to Vercel/Netlify for automatic deployments!
```

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 6
- **PWA**: vite-plugin-pwa (Workbox service worker)
- **Styling**: Tailwind CSS + Neobrutalism Design Tokens
- **Icons**: Lucide React
