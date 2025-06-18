# Twitter Mock Frontend

A modern, responsive React frontend that mimics Twitter's interface and connects to the Twitter API mock.

## Features

- **Home Page**: Displays a feed of all available tweets
- **Tweet Detail Page**: Shows individual tweet with full details
- **User Profile Page**: Displays user information and their tweets
- **All Tweets Page**: Browse all tweets with search functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Twitter-like UI**: Modern design with Twitter's color scheme and styling
- **User Avatars**: Dynamic avatars using Picsum Photos API with consistent seeding

## Tech Stack

- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- Lucide React for icons
- Date-fns for date formatting
- CSS with custom properties for theming
- Picsum Photos API for user avatars

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## API Connection

The frontend is configured to connect to the Twitter API mock running on `http://localhost:8000`. Make sure your API server is running before using the frontend.

## Available Routes

- `/` - Home page with tweet feed
- `/tweet/:tweetId` - Individual tweet detail page
- `/user` - User profile page
- `/tweets` - All tweets with search functionality

## Sample Tweet IDs

You can test the app with these sample tweet IDs:
- `1203021031201234032` - X Developers tweet
- `1203021031201234033` - Tech Guru tweet
- `1203021031201234034` - Code Enthusiast tweet

## Features

### Tweet Cards
- Display tweet content with author information
- Show creation date
- Interactive action buttons (like, retweet, reply, share)
- Click to view full tweet details
- **Dynamic user avatars** with fallback to initials

### User Profiles
- User avatar with consistent image based on user ID
- User statistics (tweets, following, followers)
- List of user's tweets

### Search Functionality
- Search tweets by content or username
- Real-time filtering
- Result count display

### Responsive Design
- Mobile-friendly layout
- Adaptive navigation
- Touch-friendly interactions

### Avatar System
- Uses [Picsum Photos API](https://picsum.photos/) for random images
- Consistent avatars per user (same user always gets same image)
- Automatic fallback to user initials if image fails to load
- Different sizes for different contexts (48px for tweets, 120px for profiles)

## Development

The project structure follows React best practices:

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── utils/         # Utility functions (avatar generation, etc.)
├── types.ts       # TypeScript type definitions
├── api.ts         # API service functions
├── App.tsx        # Main app component
└── index.tsx      # App entry point
```

## Styling

The app uses CSS custom properties for consistent theming:
- Twitter blue: `#1d9bf0`
- Twitter black: `#0f1419`
- Twitter gray: `#536471`
- Twitter border: `#cfd9de`

All styles are in `src/index.css` with responsive breakpoints for mobile devices. 