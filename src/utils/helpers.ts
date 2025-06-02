import { Anime } from '../types';

// Format date to readable string
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return 'Unknown';
  }
};

// Format year from date string
export const formatYear = (dateString: string | null): string => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  } catch (error) {
    return 'Unknown';
  }
};

// Format rating to one decimal place
export const formatRating = (rating: number | null): string => {
  if (!rating) return 'N/A';
  return rating.toFixed(1);
};

// Format runtime in minutes to hours and minutes
export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return 'Unknown';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}m`;
  }
};



// Get anime image URL
export const getAnimeImageUrl = (
  anime: Anime,
  size: 'small' | 'medium' | 'large' = 'medium'
): string => {
  const images = anime.images?.jpg || anime.images?.webp;
  
  if (!images) return '';
  
  switch (size) {
    case 'small':
      return images.small_image_url || images.image_url;
    case 'large':
      return images.large_image_url || images.image_url;
    default:
      return images.image_url;
  }
};

// Truncate text to specified length
export const truncateText = (text: string | null, maxLength: number): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

// Anime-specific helper functions
export const getAnimeTitle = (anime: Anime): string => {
  return anime.title || anime.title_english || 'Unknown Title';
};

export const getAnimeYear = (anime: Anime): string => {
  return anime.year?.toString() || 'Unknown';
};

export const getAnimeRating = (anime: Anime): string => {
  return formatRating(anime.score);
};

export const getAnimeStatus = (anime: Anime): string => {
  return anime.status || 'Unknown';
};

export const getAnimeEpisodes = (anime: Anime): string => {
  if (!anime.episodes) return 'Unknown';
  return anime.episodes.toString();
};

export const getAnimeDuration = (anime: Anime): string => {
  return anime.duration || 'Unknown';
};

export const getAnimeGenres = (anime: Anime): string => {
  if (!anime.genres || anime.genres.length === 0) return 'Unknown';
  return anime.genres.map(genre => genre.name).join(', ');
};

export const getAnimeStudios = (anime: Anime): string => {
  if (!anime.studios || anime.studios.length === 0) return 'Unknown';
  return anime.studios.map(studio => studio.name).join(', ');
};

// Debounce function for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Generate unique key for FlatList items
export const generateAnimeKey = (anime: Anime, index: number): string => {
  return `anime-${anime.mal_id}-${index}`;
};

// Format anime air date
export const formatAnimeAirDate = (anime: Anime): string => {
  if (anime.aired?.from) {
    return formatDate(anime.aired.from);
  }
  return 'Unknown';
};

// Get anime season and year
export const getAnimeSeasonYear = (anime: Anime): string => {
  if (anime.season && anime.year) {
    return `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}`;
  }
  return getAnimeYear(anime);
};
