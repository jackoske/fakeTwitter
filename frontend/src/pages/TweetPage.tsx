import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, MessageCircle, Heart, Share, Repeat } from 'lucide-react';
import TweetCard from '../components/TweetCard';
import { twitterApi } from '../api';
import { Tweet, User } from '../types';
import { getAvatarUrl, getInitials } from '../utils/avatar';

const TweetPage: React.FC = () => {
  const { tweetId } = useParams<{ tweetId: string }>();
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTweet = async () => {
      if (!tweetId) return;
      
      try {
        setLoading(true);
        const response = await twitterApi.getTweet(tweetId);
        setTweet(response.data);
        if (response.includes?.users && response.includes.users.length > 0) {
          setUser(response.includes.users[0]);
        }
      } catch (err) {
        setError('Tweet not found');
        console.error('Error fetching tweet:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTweet();
  }, [tweetId]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  if (loading) {
    return <div className="loading">Loading tweet...</div>;
  }

  if (error || !tweet) {
    return (
      <div className="container">
        <div className="error">
          <p>{error || 'Tweet not found'}</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: 'var(--twitter-blue)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const userId = user?.id || tweet.author_id;

  return (
    <div className="container">
      <div className="main">
        <div style={{ marginBottom: '16px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--twitter-gray)',
              fontSize: '16px'
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        <div className="tweet-card" style={{ cursor: 'default' }}>
          <div className="tweet-header">
            <img 
              src={getAvatarUrl(userId, 48)}
              alt={`${user ? user.name : tweet.username} avatar`}
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%',
                objectFit: 'cover'
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
              style={{ 
                width: '48px', 
                height: '48px', 
                fontSize: '20px',
                display: 'none' // Hidden by default, shown on image error
              }}
            >
              {user ? getInitials(user.name) : getInitials(tweet.username)}
            </div>
            <div>
              <span className="tweet-author">
                {user ? user.name : tweet.username}
              </span>
              <span className="tweet-username">@{tweet.username}</span>
              <span className="tweet-date"> · {formatDate(tweet.created_at)}</span>
            </div>
          </div>
          
          <div className="tweet-content" style={{ fontSize: '18px', lineHeight: '1.6' }}>
            {tweet.text}
          </div>
          
          <div className="tweet-actions">
            <div className="tweet-action">
              <MessageCircle size={20} />
              <span>0</span>
            </div>
            <div className="tweet-action">
              <Repeat size={20} />
              <span>0</span>
            </div>
            <div className="tweet-action">
              <Heart size={20} />
              <span>0</span>
            </div>
            <div className="tweet-action">
              <Share size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetPage; 