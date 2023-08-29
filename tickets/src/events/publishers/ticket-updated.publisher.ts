import { Publisher, Subjects, TicketUpdateEvent } from '@hieulh-ticket/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdateEvent> {
  subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
}
