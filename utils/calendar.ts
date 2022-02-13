import {google} from 'calendar-link';

import {Plan} from '../models/plan';

/*
 * Utilities.
 */

export function openGoogleCalendarLink(plan: Plan) {
  const event = {
    title: plan.title,
    start: plan.start,
    end: plan.end,
    location: plan.location,
    description: plan.description
  };

  const calendarLink = google(event);
  globalThis.open(calendarLink);
}
