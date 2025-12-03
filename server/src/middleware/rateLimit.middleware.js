import rateLimit from 'express-rate-limit';
import { RateLimitConstants } from 'asset-management-common/constants/index.js';

export const loginLimiter = rateLimit({
    windowMs: RateLimitConstants.windowMs,
    max: RateLimitConstants.loginMaxAttempts,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    standardHeaders: RateLimitConstants.standardHeaders,
    legacyHeaders: RateLimitConstants.legacyHeaders,
    skipSuccessfulRequests: RateLimitConstants.skipSuccessfulRequestsLogin,
});

export const apiLimiter = rateLimit({
    windowMs: RateLimitConstants.windowMs,
    max: RateLimitConstants.apiMaxRequests,
    message: { message: 'Too many requests from this IP, please try again later' },
    standardHeaders: RateLimitConstants.standardHeaders,
    legacyHeaders: RateLimitConstants.legacyHeaders,
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many requests from this IP, please try again later'
        });
    }
});
