import { describe, it, expect } from 'vitest';
import { validationResult } from 'express-validator';
import { loginValidator } from '../src/validators/auth.validator.js';

describe('loginValidator', () => {
  const runValidation = async (body) => {
    const req = { body };

    await Promise.all(loginValidator.map((validation) => validation.run(req)));

    return validationResult(req);
  };

  it('allows empty email when username and password are provided', async () => {
    const result = await runValidation({
      username: 'pepepecas',
      email: '',
      password: 'password123',
    });

    expect(result.isEmpty()).toBe(true);
  });

  it('allows login with email only', async () => {
    const result = await runValidation({
      email: 'pepe@example.com',
      password: 'password123',
    });

    expect(result.isEmpty()).toBe(true);
  });
});
