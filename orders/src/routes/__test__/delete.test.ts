import { OrderStatus } from '@hieulh-ticket/common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order.model';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';

it('makes an order as cancelled', async () => {
  const token = global.signin();

  // create a ticket with Ticket model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', token)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', token)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updateOrder = await Order.findById(order.id);

  expect(updateOrder!.status).toEqual(OrderStatus.CANCELLED);
});

it('returns an error if the ticket is already reserved', async () => {
  const token = global.signin();

  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'sahdhsahd',
    status: OrderStatus.CREATED,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', token)
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserved a ticket', async () => {
  const token = global.signin();

  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', token)
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order cancelled event', async () => {
  const token = global.signin();

  // create a ticket with Ticket model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', token)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', token)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
