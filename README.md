# ⚽ Football Substitution Manager

A modern, touch-friendly web application designed for football coaches to manage substitutions and automatically assign optimal player positions using advanced optimization algorithms.

## Features

- **Player Management**: Add, edit, and delete players with jersey numbers, positions, and ratings
- **Smart Position Assignment**: Uses the Hungarian algorithm to optimize player positions based on ratings
- **Substitution System**: Make substitutions with automatic lineup recalculation
- **Touch-Friendly UI**: Optimized for iPad Safari with large buttons and intuitive controls
- **PWA Support**: Install as a home screen app on iPad
- **Local Storage**: All data persists locally in your browser
- **Example Data**: Pre-loaded with 15 sample players to get started quickly

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **Munkres-js** for Hungarian algorithm optimization
- **PWA** support with vite-plugin-pwa
- **localStorage** for data persistence

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm (or yarn/pnpm)

### Local Development

1. **Clone or download the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The app will hot-reload as you make changes

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Deployment to Vercel

### Quick Deploy

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Login to Vercel (or create account)
   - Select your project settings
   - Deploy!

### Deploy via Vercel Dashboard

1. **Push code to GitHub** (or GitLab/Bitbucket)

2. **Go to [vercel.com](https://vercel.com)**

3. **Click "New Project"**

4. **Import your repository**

5. **Configure build settings** (auto-detected):
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Click "Deploy"**

Your app will be live at `https://your-project.vercel.app`

### Environment Variables

No environment variables required! Everything runs client-side.

## Using on iPad

### Install as Home Screen App

1. **Open in Safari** on your iPad
2. **Tap the Share button** (square with arrow)
3. **Select "Add to Home Screen"**
4. **Tap "Add"**

The app will now work like a native app with full-screen mode and no browser UI!

## How to Use

### 1. Player Management

- Navigate to **"Players"** tab
- Click **"+ Add Player"** to add new players
- For each player:
  - Enter name and jersey number
  - Select positions they can play
  - Set skill ratings (1-10) for each position
- Edit or delete existing players as needed

### 2. Set Starting Lineup

- Navigate to **"Set Lineup"** tab
- Select up to 12 players for your starting lineup
- Click **"Optimize & Set Lineup"**
- The algorithm will automatically assign players to their best positions

### 3. Make Substitutions

- Navigate to **"Game"** tab
- View current lineup on the pitch visualization
- To substitute:
  - Select **Player OUT** from pitch
  - Select **Player IN** from bench
  - Click **"Preview Optimized Lineup"**
  - Review the changes and score impact
  - Click **"Confirm Substitution"**
- The system will recalculate optimal positions for all players

## Optimization Algorithm

The app uses the **Hungarian Algorithm** (via munkres-js library) to solve the assignment problem:

- **Objective**: Maximize total lineup quality
- **Constraints**:
  - Each player assigned to exactly one position
  - Each position filled by exactly one player
  - Players only assigned to positions they can play
- **Cost Function**: Negative of player rating (to minimize cost = maximize rating)

### Cascading Changes

When a substitution is made, the algorithm reconsiders ALL player positions to find the global optimum. This means:
- If the substitute can't play the vacated position, other players will shift
- Players may move to different positions if it improves overall team quality
- You'll see a preview showing all position changes before confirming

## File Structure

```
substitution-app/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── PlayerManager.tsx      # Player CRUD interface
│   │   ├── PositionGrid.tsx       # Visual pitch layout
│   │   ├── StartingLineup.tsx     # Lineup selection
│   │   └── SubstitutionPanel.tsx  # Substitution interface
│   ├── utils/
│   │   ├── storage.ts             # localStorage utilities
│   │   └── optimizer.ts           # Hungarian algorithm
│   ├── types/
│   │   └── index.ts               # TypeScript definitions
│   ├── App.tsx          # Main app component
│   ├── App.css          # Touch-friendly styles
│   ├── main.tsx         # App entry point
│   └── index.css        # Tailwind imports
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Example Player Data

The app comes pre-loaded with 15 example players:

- 1 Goalkeeper (John Smith)
- 4 Defenders (Mike Johnson, David Brown, Chris Wilson, Tom Davis)
- 4 Midfielders (James Miller, Daniel Martinez, Mark Taylor, Steve Anderson)
- 3 Forwards (Kevin Rodriguez, Alex Lopez, Robert Garcia)
- 3 Substitutes (Paul Thomas, Brian Jackson, Ryan White)

Each player has:
- Realistic position flexibility
- Varied skill ratings (1-10)
- Unique jersey numbers

You can edit or delete these and add your own players!

## Browser Compatibility

- **Recommended**: iPad Safari (iOS 14+)
- **Supported**:
  - Chrome/Edge (Desktop & Mobile)
  - Firefox (Desktop & Mobile)
  - Safari (Desktop & Mobile)

## Data Persistence

All data is stored locally in your browser's localStorage:
- **Players**: All player information
- **Game State**: Current lineup and bench
- **Automatic Save**: Changes save immediately

To clear all data, use the **"Clear All Data"** button in the header.

## Troubleshooting

### App doesn't load
- Check browser console for errors
- Clear browser cache and reload
- Ensure JavaScript is enabled

### Players not saving
- Check if localStorage is enabled in browser
- Check browser storage quota

### Optimization seems wrong
- Verify player ratings are set correctly
- Check that players can actually play assigned positions
- Review the "Total Rating" score

### Touch not working properly
- Ensure you're using a supported browser
- Try refreshing the page
- Check if browser extensions are interfering

## Contributing

Feel free to fork and customize this app for your team's needs!

## License

MIT License - use freely for your team!

## Support

For issues or questions, please check the code comments or contact your developer.

---

**Built with ❤️ for football coaches**
