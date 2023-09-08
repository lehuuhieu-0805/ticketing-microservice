import {
  NotFoundError,
  currentUser,
  errorHandler,
} from '@hieulh-ticket/common';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import {
  createOrderRouter,
  deleteOrderRouter,
  showOrderRouter,
} from './routes';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
