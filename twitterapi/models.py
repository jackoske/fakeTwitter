from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class Media(BaseModel):
    height: int
    media_key: str
    type: str
    width: int

class GeoGeometry(BaseModel):
    coordinates: List[float]
    type: str

class Geo(BaseModel):
    bbox: List[float]
    geometry: GeoGeometry
    properties: Dict[str, Any]
    type: str

class Place(BaseModel):
    contained_within: List[str]
    country: str
    country_code: str
    full_name: str
    geo: Geo
    id: str
    name: str
    place_type: str

class PollOption(BaseModel):
    label: str
    position: int
    votes: int

class Poll(BaseModel):
    duration_minutes: int
    end_datetime: str
    id: str
    options: List[PollOption]
    voting_status: str

class Topic(BaseModel):
    description: str
    id: str
    name: str

class Tweet(BaseModel):
    author_id: str
    created_at: str
    id: str
    text: str
    username: str

class User(BaseModel):
    created_at: str
    id: str
    name: str
    protected: bool
    username: str

class Error(BaseModel):
    detail: str
    status: int
    title: str
    type: str

class Includes(BaseModel):
    media: Optional[List[Media]] = None
    places: Optional[List[Place]] = None
    polls: Optional[List[Poll]] = None
    topics: Optional[List[Topic]] = None
    tweets: Optional[List[Tweet]] = None
    users: Optional[List[User]] = None

class TwitterResponse(BaseModel):
    data: Tweet
    errors: Optional[List[Error]] = None
    includes: Optional[Includes] = None 