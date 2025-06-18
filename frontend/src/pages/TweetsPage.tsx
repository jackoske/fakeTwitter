import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TweetCard from '../components/TweetCard';
import { twitterApi } from '../api';
import { Tweet, User } from '../types';

const TweetsPage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredTweets = tweets.filter(tweet =>
    tweet.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tweet.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading all tweets...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="main">
        <h1 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>
          All Tweets
        </h1>
        
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search tweets or usernames..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid var(--twitter-border)',
              borderRadius: '20px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px', color: 'var(--twitter-gray)' }}>
          {filteredTweets.length} of {tweets.length} tweets
        </div>

        {filteredTweets.length === 0 ? (
          <div className="loading">
            {searchTerm ? 'No tweets match your search' : 'No tweets available'}
          </div>
        ) : (
          filteredTweets.map((tweet) => (
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

export default TweetsPage; 