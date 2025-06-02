import { jikanClient, apiRequest } from './httpClient';
import { ENDPOINTS } from '../constants/api';
import { Anime, JikanResponse, MalEntity } from '../types';

export class AnimeService {
  // Get top anime
  static async getTopAnime(
    page: number = 1,
    type: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music' = 'tv'
  ): Promise<JikanResponse<Anime>> {
    return apiRequest<JikanResponse<Anime>>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.TOP_ANIME,
      params: {
        page,
        type,
        filter: 'bypopularity',
      },
    });
  }

  // Get anime by ranking
  static async getAnimeByRanking(
    page: number = 1,
    filter: 'airing' | 'upcoming' | 'bypopularity' | 'favorite' = 'bypopularity'
  ): Promise<JikanResponse<Anime>> {
    return apiRequest<JikanResponse<Anime>>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.TOP_ANIME,
      params: {
        page,
        filter,
      },
    });
  }

  // Get seasonal anime (currently airing)
  static async getSeasonalAnime(page: number = 1): Promise<JikanResponse<Anime>> {
    return apiRequest<JikanResponse<Anime>>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.CURRENT_SEASON,
      params: { page },
    });
  }

  // Get seasonal anime by year and season
  static async getSeasonalAnimeByYear(
    year: number,
    season: string,
    page: number = 1
  ): Promise<JikanResponse<Anime>> {
    return apiRequest<JikanResponse<Anime>>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.SEASONAL_ANIME(year, season),
      params: { page },
    });
  }

  // Get anime details
  static async getAnimeDetails(animeId: number): Promise<{ data: Anime }> {
    return apiRequest<{ data: Anime }>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.ANIME_DETAILS(animeId),
    });
  }

  // Get full anime details
  static async getAnimeFullDetails(animeId: number): Promise<{ data: Anime }> {
    return apiRequest<{ data: Anime }>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.ANIME_FULL_DETAILS(animeId),
    });
  }

  // Search anime
  static async searchAnime(
    query: string,
    page: number = 1,
    filters: {
      type?: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music';
      status?: 'airing' | 'complete' | 'upcoming';
      rating?: 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx';
      genre?: number;
      orderBy?: 'mal_id' | 'title' | 'start_date' | 'end_date' | 'episodes' | 'score' | 'scored_by' | 'rank' | 'popularity' | 'members' | 'favorites';
      sort?: 'desc' | 'asc';
    } = {}
  ): Promise<JikanResponse<Anime>> {
    const params: any = {
      q: query,
      page,
      limit: 20,
    };

    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.rating) params.rating = filters.rating;
    if (filters.genre) params.genres = filters.genre;
    if (filters.orderBy) params.order_by = filters.orderBy;
    if (filters.sort) params.sort = filters.sort;

    return apiRequest<JikanResponse<Anime>>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.ANIME_SEARCH,
      params,
    });
  }

  // Get anime genres
  static async getAnimeGenres(): Promise<{ data: MalEntity[] }> {
    return apiRequest<{ data: MalEntity[] }>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.ANIME_GENRES,
    });
  }

  // Get anime by category
  static async getAnimeByCategory(
    category: 'popular' | 'airing' | 'upcoming' | 'top_rated',
    page: number = 1
  ): Promise<JikanResponse<Anime>> {
    switch (category) {
      case 'popular':
        return this.getAnimeByRanking(page, 'bypopularity');
      case 'airing':
        return this.getAnimeByRanking(page, 'airing');
      case 'upcoming':
        return this.getAnimeByRanking(page, 'upcoming');
      case 'top_rated':
        return this.getTopAnime(page);
      default:
        return this.getAnimeByRanking(page, 'bypopularity');
    }
  }

  // Get random anime recommendations
  static async getRandomAnime(): Promise<{ data: Anime }> {
    return apiRequest<{ data: Anime }>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.RANDOM_ANIME,
    });
  }

  // Get anime by genre
  static async getAnimeByGenre(
    genreId: number,
    page: number = 1
  ): Promise<JikanResponse<Anime>> {
    return apiRequest<JikanResponse<Anime>>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.ANIME_SEARCH,
      params: {
        genres: genreId,
        page,
        order_by: 'score',
        sort: 'desc',
      },
    });
  }

  // Get anime recommendations
  static async getAnimeRecommendations(animeId: number): Promise<{ data: any[] }> {
    return apiRequest<{ data: any[] }>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.ANIME_RECOMMENDATIONS(animeId),
    });
  }

  // Get anime characters
  static async getAnimeCharacters(animeId: number): Promise<{ data: any[] }> {
    return apiRequest<{ data: any[] }>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.ANIME_CHARACTERS(animeId),
    });
  }

  // Get anime staff
  static async getAnimeStaff(animeId: number): Promise<{ data: any[] }> {
    return apiRequest<{ data: any[] }>(jikanClient, {
      method: 'GET',
      url: ENDPOINTS.ANIME_STAFF(animeId),
    });
  }
}

export default AnimeService;
