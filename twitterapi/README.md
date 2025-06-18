# Twitter API Mock

A simple FastAPI application that mimics the Twitter API v2 structure for testing and development purposes.

## Features

- Twitter API v2 compatible response structure
- Sample tweet data stored in external JSON files
- Proper error handling for non-existent tweets
- Pydantic models for type safety
- Modular code structure for easy maintenance

## Project Structure

```
├── main.py              # FastAPI application entry point
├── models.py            # Pydantic models for data validation
├── data_loader.py       # Utility functions to load JSON data
├── data/
│   └── sample_tweets.json  # Sample tweet data
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Get Tweet by ID
```
GET /2/tweet/{tweet_id}
```

**Available sample tweet IDs:**
- `1203021031201234032` - X Developers tweet about API endpoints
- `1203021031201234033` - Tech Guru tweet with location data
- `1203021031201234034` - Code Enthusiast tweet with poll

**Example Response:**
```json
{
  "data": {
    "author_id": "2244994945",
    "created_at": "Wed Jan 06 18:40:40 +0000 2021",
    "id": "1203021031201234032",
    "text": "Learn how to use the user Tweet timeline and user mention timeline endpoints in the X API v2 to explore Tweet… https://t.co/56a0vZUx7i",
    "username": "XDevelopers"
  },
  "includes": {
    "users": [...],
    "topics": [...]
  }
}
```

### Other Endpoints
- `GET /` - Root endpoint with API information and available tweet IDs
- `GET /tweets` - List all available tweet IDs
- `GET /health` - Health check endpoint
- `GET /docs` - Interactive API documentation (Swagger UI)

## Response Structure

The API follows the Twitter API v2 structure with:

- **data**: The main tweet information
- **includes**: Additional related data (users, places, polls, topics, media)
- **errors**: Error information when applicable

## Adding New Sample Data

To add new sample tweets, simply edit the `data/sample_tweets.json` file. The structure should follow the Twitter API v2 format:

```json
{
  "tweet_id": {
    "data": {
      "author_id": "...",
      "created_at": "...",
      "id": "...",
      "text": "...",
      "username": "..."
    },
    "includes": {
      "users": [...],
      "places": [...],
      "polls": [...],
      "topics": [...]
    }
  }
}
```

## Testing

You can test the API using curl:

```bash
# Get a specific tweet
curl http://localhost:8000/2/tweet/1203021031201234032

# List all available tweets
curl http://localhost:8000/tweets

# Try a non-existent tweet (will return 404)
curl http://localhost:8000/2/tweet/9999999999999999999
```

Or visit the interactive documentation at `http://localhost:8000/docs` when the server is running.

## Code Organization

- **`main.py`**: Contains the FastAPI application and route handlers
- **`models.py`**: Pydantic models for data validation and serialization
- **`data_loader.py`**: Utility functions to load and manage JSON data files
- **`data/sample_tweets.json`**: External JSON file containing sample tweet data

This modular structure makes it easy to:
- Add new sample data without touching the application code
- Maintain and update data models independently
- Test different data scenarios by swapping JSON files 