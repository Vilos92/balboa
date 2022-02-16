import {google} from 'calendar-link';

import {Plan} from '../models/plan';
import {formatLocationString} from './window';

/*
 * Utilities.
 */

export function openGoogleCalendarLink(plan: Plan) {
  const event = {
    title: plan.title,
    start: plan.start,
    end: plan.end,
    location: plan.location,
    description: computeCalendarDescription(plan.description)
  };

  const calendarLink = google(event);
  globalThis.open(calendarLink);
}

function computeCalendarDescription(planDescription: string): string {
  const locationString = formatLocationString();

  return `${planDescription}\n\n[Created with <a href="${locationString}">Grueplan</a>]`;
}
