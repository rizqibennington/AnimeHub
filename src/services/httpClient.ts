import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, ERROR_MESSAGES } from '../constants/api';

// Create base HTTP client
const createHttpClient = (baseURL: string, timeout: number = API_CONFIG.TIMEOUT): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      console.log(`Making request to: ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`Response received from: ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('Response error:', error);
      
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        error.message = ERROR_MESSAGES.TIMEOUT;
      } else if (error.response?.status === 404) {
        error.message = ERROR_MESSAGES.NOT_FOUND;
      } else if (error.response?.status === 429) {
        error.message = ERROR_MESSAGES.RATE_LIMIT;
      } else if (!error.response) {
        error.message = ERROR_MESSAGES.NETWORK_ERROR;
      } else {
        error.message = ERROR_MESSAGES.API_ERROR;
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// Jikan HTTP Client (MyAnimeList API)
export const jikanClient = createHttpClient(API_CONFIG.JIKAN.BASE_URL);

// Rate limiting for Jikan API
let lastJikanRequest = 0;
const JIKAN_RATE_LIMIT_MS = 1000 / API_CONFIG.JIKAN.RATE_LIMIT;

jikanClient.interceptors.request.use(async (config) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastJikanRequest;
  
  if (timeSinceLastRequest < JIKAN_RATE_LIMIT_MS) {
    const delay = JIKAN_RATE_LIMIT_MS - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastJikanRequest = Date.now();
  return config;
});

// Generic API request function
export const apiRequest = async <T>(
  client: AxiosInstance,
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await client.request<T>(config);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Helper function to handle caching (for future implementation)
export const getCacheKey = (endpoint: string, params: Record<string, any> = {}): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {} as Record<string, any>);

  return `${endpoint}_${JSON.stringify(sortedParams)}`;
};

// Helper function to handle pagination
export const buildPaginatedUrl = (
  endpoint: string,
  page: number = 1,
  additionalParams: Record<string, any> = {}
): string => {
  const params = new URLSearchParams({
    page: page.toString(),
    ...additionalParams,
  });
  
  return `${endpoint}?${params.toString()}`;
};
