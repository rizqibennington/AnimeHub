# 🎌 AnimeHub

A cross-platform mobile application built with React Native and Expo that showcases anime series and movies. This project demonstrates modern mobile development practices and serves as a portfolio piece for anime enthusiasts.

## 🚀 Features

- **Anime Discovery**: Browse top-rated, popular, and seasonal anime
- **Advanced Search**: Search anime by title, genre, year, and more
- **Detailed Information**: View comprehensive anime details including synopsis, ratings, episodes, and studios
- **Categories & Rankings**: Explore anime by different categories and rankings
- **Seasonal Anime**: Browse anime by season and year
- **Genre Filtering**: Filter anime by genres and demographics
- **Responsive Design**: Optimized for both Android and iOS
- **Professional UI**: Clean, modern interface with smooth animations

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **HTTP Client**: Axios
- **Image Handling**: Expo Image
- **Icons**: Expo Vector Icons & React Native Vector Icons
- **API**: Jikan API v4 (MyAnimeList unofficial API)

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
   git clone https://github.com/rizqibennington/AnimeHub.git
   cd AnimeHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **API Configuration**

   **Jikan API:**
   - No API key required! Jikan API is completely free to use
   - The app is ready to run out of the box

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
AnimeHub/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AnimeCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── screens/            # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── AnimeDetailsScreen.tsx
│   │   └── AnimeListScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── services/          # API services
│   │   ├── httpClient.ts
│   │   └── animeService.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Helper functions
│   │   └── helpers.ts
│   └── constants/         # App constants
│       └── api.ts
├── assets/                # Images, icons, etc.
├── docs/                  # Documentation
├── Memory-Bank.md         # Project memory and decisions
├── Todo.md               # Development progress tracking
└── README.md
```

## 🔗 API Documentation

### Jikan API v4
- **Base URL**: `https://api.jikan.moe/v4`
- **Documentation**: [Jikan API Docs](https://docs.api.jikan.moe/)
- **Rate Limit**: 3 requests per second
- **Data Source**: MyAnimeList.net
- **Authentication**: None required (completely free!)

## 🚧 Development Status

- ✅ **Phase 1**: Project setup and foundation
- ✅ **Phase 2**: Core API integration
- ✅ **Phase 3**: UI components development
- 🔄 **Phase 4**: Screen implementation (In Progress)
- ⏳ **Phase 5**: Features and polish
- ⏳ **Phase 6**: Testing and documentation
- ⏳ **Phase 7**: Portfolio preparation

## 🎯 Current Features

- ✅ Home screen with popular, top-rated, and seasonal anime
- ✅ Anime card components with ratings and episode counts
- ✅ Navigation system with bottom tabs
- ✅ Loading states and error handling
- ✅ Responsive design for mobile devices
- 🔄 Search functionality (In Progress)
- 🔄 Detailed anime information screens (In Progress)
- ⏳ Genre filtering and advanced search
- ⏳ Favorites and watchlist functionality

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is for educational and portfolio purposes.

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) for providing free anime data from MyAnimeList
- [MyAnimeList](https://myanimelist.net/) for the comprehensive anime database
- [Expo](https://expo.dev/) for the amazing development platform
- [React Navigation](https://reactnavigation.org/) for navigation solutions
- [React Native Community](https://reactnative.dev/) for the excellent framework
