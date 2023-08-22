import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const token = global.signin();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', token)
    .send({ title: 'testing', price: 10 })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'testing', price: 10 })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const token = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', token)
    .send({ title: 'testing', price: 10 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', token)
    .send({ title: 'testing 2', price: 100 })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const token = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', token)
    .send({ title: 'testing', price: 10 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', token)
    .send({ title: '', price: 10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', token)
    .send({ title: 'testing 2', price: -10 })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const token = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', token)
    .send({ title: 'testing', price: 10 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', token)
    .send({ title: 'testing 2', price: 100 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('testing 2');
  expect(ticketResponse.body.price).toEqual('100');
});
