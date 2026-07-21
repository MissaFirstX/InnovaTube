import rateLimit from 'express-rate-limit';

// Global limiter: reasonable default for API
export const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

// Auth limiter: stricter for login/register endpoints to mitigate brute force
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many auth attempts from this IP, please try again later.',
});

export default { globalLimiter, authLimiter };
