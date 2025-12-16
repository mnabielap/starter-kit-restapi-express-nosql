import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import httpStatus from 'http-status';
import { config } from './config/config';
import { morgan } from './config';
import routes from './routes/v1';
import { errorConverter, errorHandler } from './middlewares/error';
import { ApiError } from './utils/ApiError';
import { authLimiter } from './middlewares/rateLimiter';

const app = express();

app.set('trust proxy', 1); 

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options(/(.*)/, cors());

// Apply Rate Limiter to Auth routes in production
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;