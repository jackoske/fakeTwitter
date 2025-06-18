import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TweetCard from '../components/TweetCard';
import { twitterApi } from '../api';
import { Tweet, User } from '../types';
import { getAvatarUrl, getInitials } from '../utils/avatar';

const UserPage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await twitterApi.getTweets();
        setTweets(response.data || []);
        setUsers(response.includes?.users || []);
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleTweetClick = (tweetId: string) => {
    navigate(`/tweet/${tweetId}`);
  };

  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  // Mock user data - in a real app this would come from the API
  const mockUser: User = {
    id: '2244994945',
    name: 'X Developers',
    username: 'XDevelopers'
  };

  if (loading) {
    return <div className="loading">Loading user profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const userTweets = tweets.filter(tweet => tweet.author_id === mockUser.id);

  return (
    <div className="container">
      <div className="main">
        <div className="user-profile">
          <img 
            src={getAvatarUrl(mockUser.id, 120)}
            alt={`${mockUser.name} avatar`}
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%',
              objectFit: 'cover',
              margin: '0 auto 16px',
              display: 'block'
            }}
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div 
            className="user-avatar"
            style={{ display: 'none' }} // Hidden by default, shown on image error
          >
            {getInitials(mockUser.name)}
          </div>
          <h1 className="user-name">{mockUser.name}</h1>
          <p className="user-username">@{mockUser.username}</p>
          
          <div style={{ 
            display: 'flex', 
            gap: '24px', 
            justifyContent: 'center',
            marginBottom: '32px',
            color: 'var(--twitter-gray)'
          }}>
            <div>
              <strong style={{ color: 'var(--twitter-black)' }}>{userTweets.length}</strong> Tweets
            </div>
            <div>
              <strong style={{ color: 'var(--twitter-black)' }}>0</strong> Following
            </div>
            <div>
              <strong style={{ color: 'var(--twitter-black)' }}>0</strong> Followers
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '700' }}>
          Tweets
        </h2>
        
        {userTweets.length === 0 ? (
          <div className="loading">No tweets from this user</div>
        ) : (
          userTweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              user={mockUser}
              onClick={() => handleTweetClick(tweet.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UserPage; 