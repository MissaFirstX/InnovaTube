import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/config/prisma.js', () => ({
  default: {
    favorite: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}), { virtual: false });

const prisma = (await import('../src/config/prisma.js')).default;
const favoritesService = await import('../src/services/favorites.service.js');

describe('favorites.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns favorites for a user', async () => {
    prisma.favorite.findMany.mockResolvedValueOnce([{ id: 1, videoId: 'vid1', userId: 1 }]);
    const res = await favoritesService.getUserFavorites(1);
    expect(res).toHaveLength(1);
    expect(prisma.favorite.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 1 } }));
  });

  it('adds a favorite when not existing', async () => {
    prisma.favorite.findUnique.mockResolvedValueOnce(null);
    prisma.favorite.create.mockResolvedValueOnce({ id: 2, videoId: 'vid2', userId: 1 });

    const res = await favoritesService.addFavorite(1, 'vid2');
    expect(prisma.favorite.create).toHaveBeenCalled();
    expect(res).toHaveProperty('id');
  });

  it('removes a favorite when owned by user', async () => {
    prisma.favorite.findUnique.mockResolvedValueOnce({ id: 3, userId: 1 });
    prisma.favorite.delete.mockResolvedValueOnce({ id: 3, userId: 1 });

    const res = await favoritesService.removeFavorite(1, 3);
    expect(prisma.favorite.delete).toHaveBeenCalledWith({ where: { id: 3 } });
    expect(res).toHaveProperty('id');
  });
});
