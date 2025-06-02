# 🎬 CineAnime Hub

A cross-platform mobile application built with React Native and Expo that showcases popular movies and anime. This project demonstrates modern mobile development practices and serves as a portfolio piece.

## 🚀 Features

- **Movie Discovery**: Browse popular, top-rated, and upcoming movies
- **Anime Discovery**: Explore top-rated and popular anime series
- **Search Functionality**: Search across both movies and anime
- **Detailed Information**: View comprehensive details for each title
- **Responsive Design**: Optimized for both Android and iOS
- **Professional UI**: Clean, modern interface with smooth animations

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **HTTP Client**: Axios
- **Image Handling**: Expo Image
- **Icons**: Expo Vector Icons
- **APIs**: 
  - TMDb API (Movies)
  - Jikan API (Anime)

## 📱 Screenshots

*Screenshots will be added once the app is fully functional*

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CineAnimeHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Keys**
   
   **TMDb API Setup:**
   - Visit [TMDb API](https://www.themoviedb.org/settings/api)
   - Create an account and request an API key
   - Replace `YOUR_TMDB_API_KEY` in `src/constants/api.ts` with your actual API key

   **Jikan API:**
   - No API key required! Jikan is free to use

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/emulator**
   ```bash
   # For Android
   npm run android
   
   # For iOS (macOS only)
   npm run ios
   
   # For web
   npm run web
   ```

## 📁 Project Structure

```
CineAnimeHub/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── MediaCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── screens/            # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── MovieDetailsScreen.tsx
│   │   ├── AnimeDetailsScreen.tsx
│   │   ├── MovieListScreen.tsx
│   │   └── AnimeListScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── services/          # API services
│   │   ├── httpClient.ts
│   │   ├── movieService.ts
│   │   └── animeService.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Helper functions
│   │   └── helpers.ts
│   └── constants/         # App constants
│       └── api.ts
├── assets/                # Images, fonts, etc.
├── docs/                  # Documentation
└── README.md
```

## 🔗 API Documentation

### TMDb API
- **Base URL**: `https://api.themoviedb.org/3`
- **Documentation**: [TMDb API Docs](https://developer.themoviedb.org/docs)
- **Rate Limit**: 40 requests per 10 seconds

### Jikan API
- **Base URL**: `https://api.jikan.moe/v4`
- **Documentation**: [Jikan API Docs](https://docs.api.jikan.moe/)
- **Rate Limit**: 3 requests per second

## 🚧 Development Status

- ✅ **Phase 1**: Project setup and foundation
- 🔄 **Phase 2**: Core API integration (In Progress)
- ⏳ **Phase 3**: UI components development
- ⏳ **Phase 4**: Screen implementation
- ⏳ **Phase 5**: Features and polish
- ⏳ **Phase 6**: Testing and documentation

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

## 📄 License

This project is for educational and portfolio purposes.

## 🙏 Acknowledgments

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for movie data
- [Jikan API](https://jikan.moe/) for anime data
- [Expo](https://expo.dev/) for the amazing development platform
- [React Navigation](https://reactnavigation.org/) for navigation solutions
