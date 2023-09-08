import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@hieulh-ticket/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order.model';

const router = express.Router();

router.get(
  '/api/order/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('Ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    res.status(200).json(order);
  }
);

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('Ticket');

  res.status(200).json(orders);
});

export { router as showOrderRouter };
