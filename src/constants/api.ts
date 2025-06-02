// API Configuration Constants
export const API_CONFIG = {
  // Jikan API Configuration (MyAnimeList unofficial API - No API key required)
  JIKAN: {
    BASE_URL: 'https://api.jikan.moe/v4',
    RATE_LIMIT: 3, // requests per second (Jikan rate limit)
    CACHE_TIME: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },

  // Request timeout
  TIMEOUT: 10000, // 10 seconds

  // Pagination
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 25, // Jikan API limit
};

// API Endpoints
export const ENDPOINTS = {
  ANIME_SEARCH: '/anime',
  ANIME_DETAILS: (id: number) => `/anime/${id}`,
  ANIME_FULL_DETAILS: (id: number) => `/anime/${id}/full`,
  TOP_ANIME: '/top/anime',
  SEASONAL_ANIME: (year: number, season: string) => `/seasons/${year}/${season}`,
  CURRENT_SEASON: '/seasons/now',
  UPCOMING_SEASON: '/seasons/upcoming',
  ANIME_GENRES: '/genres/anime',
  ANIME_RECOMMENDATIONS: (id: number) => `/anime/${id}/recommendations`,
  ANIME_CHARACTERS: (id: number) => `/anime/${id}/characters`,
  ANIME_STAFF: (id: number) => `/anime/${id}/staff`,
  ANIME_STATISTICS: (id: number) => `/anime/${id}/statistics`,
  RANDOM_ANIME: '/random/anime',
};

// Anime-specific constants
export const ANIME_CONSTANTS = {
  SEASONS: ['winter', 'spring', 'summer', 'fall'],
  RANKING_TYPES: [
    { key: 'all', label: 'All Time' },
    { key: 'airing', label: 'Currently Airing' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'tv', label: 'TV Series' },
    { key: 'movie', label: 'Movies' },
    { key: 'ova', label: 'OVA' },
    { key: 'special', label: 'Specials' },
    { key: 'bypopularity', label: 'Most Popular' },
    { key: 'favorite', label: 'Most Favorited' },
  ],
  STATUS_TYPES: [
    { key: 'airing', label: 'Currently Airing' },
    { key: 'complete', label: 'Completed' },
    { key: 'upcoming', label: 'Upcoming' },
  ],
  ANIME_TYPES: [
    { key: 'tv', label: 'TV' },
    { key: 'movie', label: 'Movie' },
    { key: 'ova', label: 'OVA' },
    { key: 'special', label: 'Special' },
    { key: 'ona', label: 'ONA' },
    { key: 'music', label: 'Music' },
  ],
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  API_ERROR: 'Something went wrong. Please try again later.',
  NOT_FOUND: 'Anime not found.',
  TIMEOUT: 'Request timeout. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  NO_RESULTS: 'No anime found matching your search.',
};
