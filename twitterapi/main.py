from fastapi import FastAPI, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from models import TwitterResponse
from data_loader import load_sample_tweets, get_available_tweet_ids
import os
import time
from typing import Optional
from collections import defaultdict
import hashlib

app = FastAPI(title="Twitter API Mock", version="1.0.0")

# Rate limiting setup
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security
security = HTTPBearer(auto_error=False)

# Environment variables for configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
API_KEY = os.getenv("API_KEY", None)  # Set this in production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,https://fake-twitter.jackskehan.tech").split(",")

# Clean up origins (remove empty strings and whitespace)
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()]

print(f"CORS Configuration: Environment={ENVIRONMENT}, Allowed Origins={ALLOWED_ORIGINS}")

# Add CORS middleware with environment-based configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "HEAD"],
    allow_headers=["*"],
)

# In-memory storage for abuse detection (use Redis in production)
request_counts = defaultdict(list)
blocked_ips = set()

def get_client_ip(request: Request) -> str:
    """Get client IP address"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host

def is_ip_blocked(ip: str) -> bool:
    """Check if IP is blocked"""
    return ip in blocked_ips

def check_abuse_pattern(ip: str, endpoint: str) -> bool:
    """Check for abuse patterns"""
    current_time = time.time()
    window = 60  # 1 minute window
    
    # Clean old requests
    request_counts[ip] = [req for req in request_counts[ip] if current_time - req['time'] < window]
    
    # Add current request
    request_counts[ip].append({
        'time': current_time,
        'endpoint': endpoint
    })
    
    # Check for abuse patterns
    recent_requests = request_counts[ip]
    
    # Pattern 1: Too many requests in short time
    if len(recent_requests) > 100:  # 100 requests per minute
        blocked_ips.add(ip)
        return True
    
    # Pattern 2: Rapid repeated requests to same endpoint
    endpoint_counts = {}
    for req in recent_requests:
        endpoint_counts[req['endpoint']] = endpoint_counts.get(req['endpoint'], 0) + 1
    
    for endpoint, count in endpoint_counts.items():
        if count > 30:  # 30 requests per minute to same endpoint
            blocked_ips.add(ip)
            return True
    
    return False

# API Key validation function
async def verify_api_key(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if ENVIRONMENT == "production" and API_KEY:
        if not credentials or credentials.credentials != API_KEY:
            raise HTTPException(
                status_code=401,
                detail="Invalid API key"
            )
    return True

# Abuse protection middleware
@app.middleware("http")
async def abuse_protection(request: Request, call_next):
    client_ip = get_client_ip(request)
    
    # Check if IP is blocked
    if is_ip_blocked(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Too many requests. IP temporarily blocked."
        )
    
    # Check for abuse patterns
    if check_abuse_pattern(client_ip, request.url.path):
        raise HTTPException(
            status_code=429,
            detail="Abuse detected. IP blocked."
        )
    
    response = await call_next(request)
    return response

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
@limiter.limit("30/minute")  # 30 requests per minute per IP
async def get_tweet(request: Request, tweet_id: str, _: bool = Depends(verify_api_key)):
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
@limiter.limit("60/minute")  # 60 requests per minute per IP
async def list_tweets(request: Request, _: bool = Depends(verify_api_key)):
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