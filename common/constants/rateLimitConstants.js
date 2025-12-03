const RateLimitConstants = {
    loginMaxAttempts: 5,
    apiMaxRequests: 100,
    windowMs: 15 * 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequestsLogin: false
};

export default RateLimitConstants;
