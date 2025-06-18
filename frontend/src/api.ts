import axios from 'axios';
import { TweetResponse, TweetsListResponse } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_KEY = process.env.REACT_APP_API_KEY;

// Debug logging (remove in production)
console.log('API Configuration:', {
  API_BASE_URL,
  API_KEY: API_KEY ? '***SET***' : 'NOT SET'
});

// Request throttling and caching
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const REQUEST_DELAY = 1000; // 1 second between requests
let lastRequestTime = 0;

// Throttle function
const throttle = (func: Function, delay: number) => {
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastRequestTime >= delay) {
      lastRequestTime = now;
      return func(...args);
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          lastRequestTime = Date.now();
          func(...args).then(resolve).catch(reject);
        }, delay - (now - lastRequestTime));
      });
    }
  };
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` })
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded. Please wait before making more requests.');
    }
    return Promise.reject(error);
  }
);

// Cached request function
const cachedRequest = async (url: string, fetcher: () => Promise<any>) => {
  const cacheKey = url;
  const cached = requestCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Using cached response for:', url);
    return cached.data;
  }
  
  const data = await fetcher();
  requestCache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
};

export const twitterApi = {
  // Get a specific tweet by ID
  getTweet: throttle(async (tweetId: string): Promise<TweetResponse> => {
    return cachedRequest(`/2/tweet/${tweetId}`, async () => {
      const response = await api.get(`/2/tweet/${tweetId}`);
      return response.data;
    });
  }, REQUEST_DELAY),

  // Get all available tweets
  getTweets: throttle(async (): Promise<TweetsListResponse> => {
    return cachedRequest('/tweets', async () => {
      const response = await api.get('/tweets');
      return response.data;
    });
  }, REQUEST_DELAY),

  // Get available tweet IDs
  getTweetIds: throttle(async (): Promise<string[]> => {
    return cachedRequest('/tweets', async () => {
      const response = await api.get('/tweets');
      return response.data;
    });
  }, REQUEST_DELAY),

  // Health check
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },

  // Clear cache (useful for testing)
  clearCache: () => {
    requestCache.clear();
    console.log('API cache cleared');
  },
}; 