export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

export interface VideoData {
  nextPageToken: string;
  prevPageToken: string;
  totalResults: number;
  resultsPerPage: number;
  videos: Video[];
}

export interface VideosResponse {
  success: boolean;
  message: string;
  data: VideoData;
}
