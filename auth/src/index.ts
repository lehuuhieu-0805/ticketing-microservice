import cookieSession from 'cookie-session';
import express from 'express';
import mongoose from 'mongoose';
import { NotFoundError } from './errors';
import { errorHandler } from './middlewares/error-handler.middleware';
import { currentUserRouter, signinRouter, signupRouter } from './routes';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

const PORT = process.env.PORT || 4001;

app.use(signupRouter);
app.use(currentUserRouter);
app.use(signinRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
  } catch (error) {
    console.log(error);
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
