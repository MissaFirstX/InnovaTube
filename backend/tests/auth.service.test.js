import { describe, it, expect, vi, beforeEach } from 'vitest';

// Ensure required env vars for services
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

vi.mock('../src/config/prisma.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}), { virtual: false });

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(() => Promise.resolve('hashed')),
    compare: vi.fn(() => Promise.resolve(true)),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'token123'),
  },
}));

const prisma = (await import('../src/config/prisma.js')).default;
const authService = await import('../src/services/auth.service.js');

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers a new user when username and email are unique', async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    prisma.user.create.mockResolvedValueOnce({ id: 1, username: 'bob', email: 'bob@example.com' });

    const payload = { firstName: 'Bob', lastName: 'B', username: 'bob', email: 'bob@example.com', password: 'password' };
    const result = await authService.register(payload);

    expect(prisma.user.findUnique).toHaveBeenCalled();
    expect(prisma.user.create).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
  });

  it('logs in with email and returns token + user data', async () => {
    const userFromDb = { id: 2, username: 'alice', email: 'alice@example.com', password: 'hashed' };
    prisma.user.findFirst.mockResolvedValueOnce(userFromDb);

    const result = await authService.login({ email: 'alice@example.com', password: 'password' });

    expect(prisma.user.findFirst).toHaveBeenCalled();
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('id');
  });
});
