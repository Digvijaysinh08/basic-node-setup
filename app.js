import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routers/userrouters.js';

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

app.get('/', (_req, res) => {
    res.send('Hello World!');
});
app.use('/api/v1/users', userRouter);

app.use((err, _req, res, _next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).json({ success: false, message: 'Invalid JSON format' });
    }

    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        errors: err.errors || [],
    });
});

export default app;
