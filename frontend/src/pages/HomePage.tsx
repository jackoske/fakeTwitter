import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TweetCard from '../components/TweetCard';
import { twitterApi } from '../api';
import { Tweet, User } from '../types';

const HomePage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        const response = await twitterApi.getTweets();
        setTweets(response.data || []);
        setUsers(response.includes?.users || []);
      } catch (err) {
        setError('Failed to load tweets');
        console.error('Error fetching tweets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  const handleTweetClick = (tweetId: string) => {
    navigate(`/tweet/${tweetId}`);
  };

  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  if (loading) {
    return <div className="loading">Loading tweets...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="main">
        <h1 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>
          Latest Tweets
        </h1>
        {tweets.length === 0 ? (
          <div className="loading">No tweets available</div>
        ) : (
          tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              user={getUserById(tweet.author_id)}
              onClick={() => handleTweetClick(tweet.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage; 