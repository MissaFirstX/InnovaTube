import prisma from "../config/prisma.js";

export const getUserFavorites = async (userId) => {
  return prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const addFavorite = async (userId, videoId) => {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.favorite.create({
    data: {
      userId,
      videoId,
    },
  });
};

export const removeFavorite = async (userId, favoriteId) => {
  const favorite = await prisma.favorite.findUnique({
    where: { id: favoriteId },
  });

  if (!favorite || favorite.userId !== userId) {
    throw new Error("Favorite not found or access denied");
  }

  return prisma.favorite.delete({
    where: { id: favoriteId },
  });
};
