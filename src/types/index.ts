// Anime Types (Jikan API - MyAnimeList)
export interface Anime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  };
  approved: boolean;
  titles: AnimeTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    prop: {
      from: DateProp;
      to: DateProp;
    };
    string: string;
  };
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: MalEntity[];
  licensors: MalEntity[];
  studios: MalEntity[];
  genres: MalEntity[];
  explicit_genres: MalEntity[];
  themes: MalEntity[];
  demographics: MalEntity[];
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface DateProp {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface MalEntity {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

// API Response Types
export interface JikanResponse<T> {
  data: T[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  AnimeDetails: { animeId: number };
  Search: undefined;
  AnimeList: { category: string };
  Rankings: undefined;
  Seasonal: { year?: number; season?: string };
  Genres: undefined;
};

// Component Props Types
export interface AnimeCardProps {
  item: Anime;
  onPress: () => void;
  width?: number;
}

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

// State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AnimeState extends LoadingState {
  anime: Anime[];
  searchResults: Anime[];
  currentPage: number;
  hasNextPage: boolean;
}

// Filter Types
export interface AnimeFilters {
  type?: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music';
  status?: 'airing' | 'complete' | 'upcoming';
  rating?: 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx';
  genre?: number;
  orderBy?: 'mal_id' | 'title' | 'start_date' | 'end_date' | 'episodes' | 'score' | 'scored_by' | 'rank' | 'popularity' | 'members' | 'favorites';
  sort?: 'desc' | 'asc';
}
