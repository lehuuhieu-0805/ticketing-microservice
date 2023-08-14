import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/users/current-user', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'current-user',
  });
});

export { router as currentUserRouter };
