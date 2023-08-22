import { NotFoundError } from '@hieulh-ticket/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket.model';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.status(200).json(tickets);
});

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).json(ticket);
});

export { router as showTicketRouter };
