import { currentUser } from '@hieulh-ticket/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get(
  '/api/users/current-user',
  currentUser,
  (req: Request, res: Response) => {
    res.status(200).json({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
