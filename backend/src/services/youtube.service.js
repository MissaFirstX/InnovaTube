import dotenv from "dotenv";

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

if (!YOUTUBE_API_KEY) {
  throw new Error("YOUTUBE_API_KEY is required in .env to use YouTube search");
}

export const searchYouTubeVideos = async (query, pageToken) => {
  const url = new URL(`${BASE_URL}/search`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "12");
  url.searchParams.set("q", query);
  url.searchParams.set("key", YOUTUBE_API_KEY);
  if (pageToken) {
    url.searchParams.set("pageToken", pageToken);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`YouTube API error: ${response.status} ${errorBody}`);
  }

  const data = await response.json();

  return {
    nextPageToken: data.nextPageToken,
    prevPageToken: data.prevPageToken,
    totalResults: data.pageInfo?.totalResults ?? null,
    resultsPerPage: data.pageInfo?.resultsPerPage ?? null,
    videos: data.items.map((item) => ({
      id: item.id?.videoId,
      title: item.snippet?.title,
      description: item.snippet?.description,
      thumbnail:
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url,
      channelTitle: item.snippet?.channelTitle,
      publishedAt: item.snippet?.publishedAt,
    })),
  };
};

export const getYouTubeVideoById = async (videoId) => {
  const url = new URL(`${BASE_URL}/videos`);
  url.searchParams.set("part", "snippet,contentDetails,statistics");
  url.searchParams.set("id", videoId);
  url.searchParams.set("key", YOUTUBE_API_KEY);

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`YouTube API error: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const item = data.items?.[0];

  if (!item) {
    throw new Error("Video not found");
  }

  return {
    id: item.id,
    title: item.snippet?.title,
    description: item.snippet?.description,
    publishedAt: item.snippet?.publishedAt,
    channelTitle: item.snippet?.channelTitle,
    thumbnail:
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.default?.url,
    duration: item.contentDetails?.duration,
    viewCount: item.statistics?.viewCount ?? null,
    likeCount: item.statistics?.likeCount ?? null,
    commentCount: item.statistics?.commentCount ?? null,
  };
};
