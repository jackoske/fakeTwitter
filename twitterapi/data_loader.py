import json
import os
from pathlib import Path

def load_sample_tweets():
    """
    Load sample tweet data from JSON file.
    
    Returns:
        dict: Dictionary containing sample tweet data
    """
    data_file = Path(__file__).parent / "data" / "sample_tweets.json"
    
    if not data_file.exists():
        raise FileNotFoundError(f"Sample tweets data file not found: {data_file}")
    
    with open(data_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_available_tweet_ids():
    """
    Get list of available tweet IDs from the sample data.
    
    Returns:
        list: List of available tweet IDs
    """
    tweets = load_sample_tweets()
    return list(tweets.keys()) 