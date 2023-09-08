import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@hieulh-ticket/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
}
