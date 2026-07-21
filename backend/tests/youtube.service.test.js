import { describe, it, expect, vi, beforeEach } from 'vitest';

// Ensure required env var for youtube service
process.env.YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'test-youtube-key';

const fakeSearchResponse = {
  nextPageToken: 'NEXT',
  pageInfo: { totalResults: 1, resultsPerPage: 1 },
  items: [
    {
      id: { videoId: 'abc123' },
      snippet: {
        title: 'Test video',
        description: 'Desc',
        thumbnails: { medium: { url: 'http://img' } },
        channelTitle: 'Channel',
        publishedAt: '2020-01-01T00:00:00Z',
      },
    },
  ],
};

const fakeVideoResponse = {
  items: [
    {
      id: 'abc123',
      snippet: { title: 'Test video', description: 'Desc', thumbnails: { high: { url: 'http://img' } }, channelTitle: 'Channel', publishedAt: '2020-01-01T00:00:00Z' },
      contentDetails: { duration: 'PT1M' },
      statistics: { viewCount: '100' },
    },
  ],
};

vi.stubGlobal('fetch', vi.fn(async (url) => {
  if (url.toString().includes('/search')) {
    return { ok: true, json: async () => fakeSearchResponse };
  }
  if (url.toString().includes('/videos')) {
    return { ok: true, json: async () => fakeVideoResponse };
  }
  return { ok: false, status: 500, text: async () => 'error' };
}));

const youtubeService = await import('../src/services/youtube.service.js');

describe('youtube.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('searches videos by query', async () => {
    const res = await youtubeService.searchYouTubeVideos('test');
    expect(res.videos[0].id).toBe('abc123');
  });

  it('fetches video details by id', async () => {
    const res = await youtubeService.getYouTubeVideoById('abc123');
    expect(res.id).toBe('abc123');
    expect(res).toHaveProperty('duration');
  });
});
