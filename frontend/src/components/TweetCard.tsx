import React from 'react';
import { format } from 'date-fns';
import { MessageCircle, Heart, Share, Repeat } from 'lucide-react';
import { Tweet, User } from '../types';
import { getAvatarUrl, getInitials } from '../utils/avatar';

interface TweetCardProps {
  tweet: Tweet;
  user?: User;
  onClick?: () => void;
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, user, onClick }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d');
    } catch {
      return 'Unknown date';
    }
  };

  const userId = user?.id || tweet.author_id;

  return (
    <div className="tweet-card" onClick={onClick}>
      <div className="tweet-header">
        <img 
          src={getAvatarUrl(userId, 48)}
          alt={`${user ? user.name : tweet.username} avatar`}
          style={{ 
            width: '40px', 
            height: '40px', 
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
            width: '40px', 
            height: '40px', 
            fontSize: '16px',
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
      
      <div className="tweet-content">
        {tweet.text}
      </div>
      
      <div className="tweet-actions">
        <div className="tweet-action">
          <MessageCircle size={16} />
          <span>0</span>
        </div>
        <div className="tweet-action">
          <Repeat size={16} />
          <span>0</span>
        </div>
        <div className="tweet-action">
          <Heart size={16} />
          <span>0</span>
        </div>
        <div className="tweet-action">
          <Share size={16} />
        </div>
      </div>
    </div>
  );
};

export default TweetCard; 