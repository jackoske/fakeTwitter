export interface Tweet {
  author_id: string;
  created_at: string;
  id: string;
  text: string;
  username: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export interface Place {
  id: string;
  name: string;
  full_name: string;
  country: string;
}

export interface Poll {
  id: string;
  options: Array<{
    position: number;
    label: string;
    votes: number;
  }>;
  voting_status: string;
  end_datetime: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
}

export interface TweetResponse {
  data: Tweet;
  includes?: {
    users?: User[];
    places?: Place[];
    polls?: Poll[];
    topics?: Topic[];
  };
}

export interface TweetsListResponse {
  data: Tweet[];
  includes?: {
    users?: User[];
    places?: Place[];
    polls?: Poll[];
    topics?: Topic[];
  };
} 