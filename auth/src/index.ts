import express from 'express';
import { errorHandler } from './middlewares/error-handler.middleware';
import { NotFoundError } from './errors';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
