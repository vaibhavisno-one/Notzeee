export const getAllowedOrigins = () => {
    const rawOrigins = process.env.CORS_ORIGIN;
    const allowedOrigins = rawOrigins
        ? rawOrigins.split(",").map((origin) => origin.trim()).filter(Boolean)
        : [];

    if (allowedOrigins.length === 0) {
        throw new Error("CORS_ORIGIN is not defined");
    }

    return allowedOrigins;
};

export const createCorsOriginValidator = (allowedOrigins) => {
    return (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    };
};
