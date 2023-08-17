import cookieSession from 'cookie-session';
import express from 'express';
import { NotFoundError } from './errors';
import { errorHandler } from './middlewares';
import {
  currentUserRouter,
  signinRouter,
  signupRouter,
  signoutRouter,
} from './routes';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(signupRouter);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
