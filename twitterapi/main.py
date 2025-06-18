from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models import TwitterResponse
from data_loader import load_sample_tweets, get_available_tweet_ids
import os
from typing import Optional

app = FastAPI(title="Twitter API Mock", version="1.0.0")

# Security
security = HTTPBearer(auto_error=False)

# Environment variables for configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
API_KEY = os.getenv("API_KEY", None)  # Set this in production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

# Add CORS middleware with environment-based configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"] if ENVIRONMENT == "production" else ["*"],
    allow_headers=["*"] if ENVIRONMENT == "development" else ["Authorization", "Content-Type"],
)

# API Key validation function
async def verify_api_key(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if ENVIRONMENT == "production" and API_KEY:
        if not credentials or credentials.credentials != API_KEY:
            raise HTTPException(
                status_code=401,
                detail="Invalid API key"
            )
    return True

# Load sample data
try:
    SAMPLE_TWEETS = load_sample_tweets()
except FileNotFoundError as e:
    print(f"Warning: {e}")
    SAMPLE_TWEETS = {}

@app.get("/")
async def root():
    available_ids = get_available_tweet_ids()
    return {
        "message": "Twitter API Mock - Use /2/tweet/{tweet_id} to get tweet data",
        "available_tweet_ids": available_ids,
        "total_tweets": len(available_ids),
        "environment": ENVIRONMENT
    }

@app.get("/2/tweet/{tweet_id}", response_model=TwitterResponse)
async def get_tweet(tweet_id: str, _: bool = Depends(verify_api_key)):
    """
    Get a tweet by its ID.
    
    Args:
        tweet_id: The ID of the tweet to retrieve
        
    Returns:
        TwitterResponse: The tweet data with includes and optional errors
    """
    if tweet_id in SAMPLE_TWEETS:
        return SAMPLE_TWEETS[tweet_id]
    else:
        # Return error response for non-existent tweets
        raise HTTPException(
            status_code=404,
            detail={
                "data": None,
                "errors": [
                    {
                        "detail": f"Tweet with id {tweet_id} not found",
                        "status": 404,
                        "title": "Not Found",
                        "type": "https://api.twitter.com/2/problems/resource-not-found"
                    }
                ],
                "includes": None
            }
        )

@app.get("/tweets")
async def list_tweets(_: bool = Depends(verify_api_key)):
    """
    List all available tweets with their data.
    
    Returns:
        dict: List of tweets with includes data
    """
    # Convert the sample tweets to the expected format
    tweets_data = []
    all_users = []
    all_places = []
    all_polls = []
    all_topics = []
    
    for tweet_id, tweet_response in SAMPLE_TWEETS.items():
        tweets_data.append(tweet_response["data"])
        
        # Collect includes data
        if "includes" in tweet_response:
            includes = tweet_response["includes"]
            if "users" in includes:
                all_users.extend(includes["users"])
            if "places" in includes:
                all_places.extend(includes["places"])
            if "polls" in includes:
                all_polls.extend(includes["polls"])
            if "topics" in includes:
                all_topics.extend(includes["topics"])
    
    # Remove duplicates from includes
    unique_users = list({user["id"]: user for user in all_users}.values())
    unique_places = list({place["id"]: place for place in all_places}.values())
    unique_polls = list({poll["id"]: poll for poll in all_polls}.values())
    unique_topics = list({topic["id"]: topic for topic in all_topics}.values())
    
    return {
        "data": tweets_data,
        "includes": {
            "users": unique_users if unique_users else None,
            "places": unique_places if unique_places else None,
            "polls": unique_polls if unique_polls else None,
            "topics": unique_topics if unique_topics else None
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "Twitter API Mock",
        "data_loaded": len(SAMPLE_TWEETS) > 0,
        "environment": ENVIRONMENT
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 