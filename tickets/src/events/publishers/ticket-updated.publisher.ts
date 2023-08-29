import { Publisher, Subjects, TicketUpdateEvent } from '@hieulh-ticket/common';

export class TicketCreatedPublisher extends Publisher<TicketUpdateEvent> {
  subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
}
