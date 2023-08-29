import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

const createTicket = ({ title, price }: { title: string; price: number }) => {
  const token = global.signin();

  return request(app).post('/api/tickets').set('Cookie', token).send({
    title,
    price,
  });
};

it('returns a 404 if the tickets is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'testing';
  const price = 10;
  const response = await createTicket({ title, price });

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

it('can fetch a list of tickets', async () => {
  const title = 'testing';
  const price = 10;

  await createTicket({ title, price });
  await createTicket({ title, price });
  await createTicket({ title, price });

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
