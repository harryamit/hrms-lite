import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { config } from './config';
import { connectDb } from './db/connect';
import { requestIdMiddleware } from './middleware/requestId';
import { requestLogger } from './middleware/logger';
import { errorHandler, sendError } from './middleware/errorHandler';
import { generalLimiter, mutateLimiter } from './middleware/rateLimit';
import employeesRouter from './routes/employees';
import attendanceRouter from './routes/attendance';
import dashboardRouter from './routes/dashboard';
import healthRouter from './routes/health';

const app = express();

app.use(requestIdMiddleware);
app.use(requestLogger);

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
);
app.use(express.json());

app.use(generalLimiter);
app.use((req, res, next) => {
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) return mutateLimiter(req, res, next);
  next();
});

app.use('/health', healthRouter);
app.use('/api/health', healthRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/dashboard', dashboardRouter);

app.use((req, res) => {
  sendError(res, 404, 'Not found.', 'NOT_FOUND');
});

app.use(errorHandler);

async function connectDbWithRetry(): Promise<void> {
  try {
    await connectDb();
    console.log('MongoDB connected.');
  } catch (err) {
    console.error(
      'MongoDB connection failed (will retry):',
      err instanceof Error ? err.message : err
    );
    setTimeout(connectDbWithRetry, config.retryDbMs);
  }
}

function start(): void {
  app.listen(config.port, () => {
    console.log(`HRMS Lite API listening on port ${config.port} (http://localhost:${config.port}/api)`);
    connectDbWithRetry();
  });
}

start();
