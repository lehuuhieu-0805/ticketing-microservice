import { OrderCreatedEvent, Publisher, Subjects } from '@hieulh-ticket/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
}
