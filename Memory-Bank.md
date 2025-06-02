# Anime List Portfolio App - Memory Bank

## Project Overview
- **Project Name**: AnimeHub
- **Type**: Cross-platform mobile application (React Native)
- **Purpose**: Portfolio showcase for GitHub demonstrating mobile development skills with anime focus
- **Target Platforms**: Android & iOS

## Core Features
1. **Anime Listings**: Display popular, top-rated, and seasonal anime series
2. **Search Functionality**: Search anime by title, genre, and year
3. **Detailed Views**: Show comprehensive anime information (synopsis, episodes, rating, etc.)
4. **Categories/Filtering**: Filter by genre, year, rating, status, and season
5. **Rankings**: Top anime rankings by various criteria
6. **Seasonal Anime**: Browse anime by season and year
7. **Responsive Design**: Optimized for mobile devices

## Technology Stack
- **Framework**: React Native (chosen for portfolio appeal and JavaScript ecosystem)
- **Navigation**: React Navigation
- **State Management**: React Context API / Redux Toolkit
- **HTTP Client**: Axios
- **UI Components**: React Native Elements or NativeBase
- **Icons**: React Native Vector Icons

## API Selected
**Jikan API v4** (MyAnimeList unofficial API)
- Free and open source
- No API key or authentication required
- Comprehensive anime data from MyAnimeList.net
- Base URL: https://api.jikan.moe/v4/
- Key endpoints:
  - `/anime` - Search anime
  - `/top/anime` - Top anime rankings
  - `/seasons/{year}/{season}` - Seasonal anime
  - `/anime/{id}` - Anime details
  - `/genres/anime` - Anime genres

## Project Structure
```
AnimeHub/
├── src/
│   ├── components/        # Reusable UI components (AnimeCard, SearchBar, etc.)
│   ├── screens/          # Screen components (Home, Search, Details, Rankings)
│   ├── navigation/       # Navigation configuration
│   ├── services/         # Jikan API services
│   ├── utils/           # Helper functions
│   ├── constants/       # App constants (genres, seasons, etc.)
│   ├── types/           # TypeScript type definitions
│   └── assets/          # Images, fonts, etc.
├── android/             # Android-specific code
├── ios/                 # iOS-specific code
└── docs/               # Documentation and screenshots
```

## Architecture Decisions
- **Clean Architecture**: Separation of concerns with services, components, and screens
- **Component-based**: Reusable UI components for maintainability
- **API Layer**: Centralized Jikan API handling with error management and caching
- **State Management**: Context API for simple state, Redux for complex state if needed
- **TypeScript**: Strong typing for better development experience and error prevention

## Development Environment
- **OS**: Windows (Laragon environment)
- **Node.js**: Latest LTS version
- **React Native CLI**: For development and building
- **Android Studio**: For Android development and emulation
- **Xcode**: For iOS development (if available)

## Portfolio Presentation Goals
- Clean, professional code structure
- Comprehensive README with setup instructions
- Screenshots of app running on both platforms
- Live demo capabilities
- Well-documented API integration
- Error handling and loading states
- Responsive design showcase

## Recent Project Fixes (Latest Session)
- **Package Compatibility**: Fixed version mismatches for react-native-safe-area-context and react-native-screens
- **TypeScript Types**: Resolved navigation type issues by adding missing "Main" route to RootStackParamList
- **Code Organization**: Eliminated duplicate AnimeCardProps interface definitions
- **Import Verification**: Confirmed all import paths work correctly after folder structure changes
- **Build Verification**: Tested application startup and confirmed no compilation errors
