import { Publisher, Subjects, TicketCreatedEvent } from '@hieulh-ticket/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
}
