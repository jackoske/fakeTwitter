import axios from 'axios';
import { TweetResponse, TweetsListResponse } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_KEY = process.env.REACT_APP_API_KEY;

// Debug logging (remove in production)
console.log('API Configuration:', {
  API_BASE_URL,
  API_KEY: API_KEY ? '***SET***' : 'NOT SET'
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` })
  },
});

export const twitterApi = {
  // Get a specific tweet by ID
  getTweet: async (tweetId: string): Promise<TweetResponse> => {
    const response = await api.get(`/2/tweet/${tweetId}`);
    return response.data;
  },

  // Get all available tweets
  getTweets: async (): Promise<TweetsListResponse> => {
    const response = await api.get('/tweets');
    return response.data;
  },

  // Get available tweet IDs
  getTweetIds: async (): Promise<string[]> => {
    const response = await api.get('/tweets');
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
}; 