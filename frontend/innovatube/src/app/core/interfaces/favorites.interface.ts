export interface Favorite {
  id: number;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  userId: number;
  createdAt: string;
}

export interface FavoritesRequest {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  channelTitle: string;
  thumbnail: string;
}

export interface FavoritesResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    videoId: string;
    userId: number;
    createdAt: string;
  };
}

export interface ListFavoritesResponse {
  success: boolean;
  message: string;
  data: Favorite[];
}
