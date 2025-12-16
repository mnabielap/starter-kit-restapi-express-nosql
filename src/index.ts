import mongoose from 'mongoose';
import app from './app';
import { config } from './config/config';
import { logger } from './config/logger';

// --- MongoDB Connection Management for Serverless ---

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      ...config.mongoose.options,
    };

    cached.promise = mongoose.connect(config.mongoose.url, opts).then((mongooseInstance) => {
      logger.info('Connected to MongoDB');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    logger.error('Could not connect to MongoDB', e);
    throw e;
  }

  return cached.conn;
};

// --- Server Startup Logic ---

if (!process.env.VERCEL) {
  connectDB().then(() => {
    const server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info('Server closed');
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error: any) => {
      logger.error(error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received');
      if (server) {
        server.close();
      }
    });
  });
} 
// 2. For Vercel Production
else {
  const handler = async (req: any, res: any) => {
    try {
      await connectDB(); // Wait for DB connection
      return app(req, res); // Hand over to Express
    } catch (error) {
      logger.error('Database connection failed', error);
      res.status(500).json({ code: 500, message: 'Internal Server Error: Database Connection Failed' });
    }
  };
  
  module.exports = handler;
}

export default app;