import express from 'express';
import mongoose from 'mongoose';
import { errorHandler } from './middlewares/error-handler.middleware';
import { NotFoundError } from './errors';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
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
