import sendgridMail from '@sendgrid/mail';
import {compile as compileHtmlToText} from 'html-to-text';
import sanitizeHtml from 'sanitize-html';

/*
 * Constants.
 */

const sendgridApiKey = process.env.SENDGRID_API_KEY ?? '';
sendgridMail.setApiKey(sendgridApiKey);

const grueplanHandle = 'hello@grueplan.com';

/**
 * Strips an HTML string of all tags. Allows us to re-use our computed HTML string
 * for the text field of our message. I.e. HTML is the source of truth for our message.
 */
const htmlToText = compileHtmlToText({
  wordwrap: false,
  uppercaseHeadings: false
});

/*
 * Types.
 */

interface Email {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

/*
 * Utilities.
 */

export async function sendInvitationEmail(
  recipientHandle: string,
  senderUserName: string,
  planTitle: string,
  planUrl: string
) {
  const subject = `${senderUserName} has invited you to ${planTitle} 🎉`;
  const html = computeInvitationHtml(senderUserName, planTitle, planUrl);
  sendEmail(recipientHandle, subject, html);
}

/**
 * Base method for sending an email from the hello@grueplan.com handle.
 * Currently uses Sendgrid as a provider.
 */
async function sendEmail(recipientHandle: string, subject: string, html: string) {
  // Sanitize in case malicious HTML exists somewhere such as the subject.
  const sanitizedHtml = sanitizeHtml(html);
  // Strip HTML of all attributes for the text representation of this message.
  const text = htmlToText(sanitizedHtml);

  const email: Email = {
    from: grueplanHandle,
    to: recipientHandle,
    subject,
    html,
    text
  };

  try {
    await sendgridMail.send(email);
  } catch (error) {
    console.error(error);
  }
}

/*
 * Helpers.
 */

/**
 * Build the sanitized HTML for an invitation to plan from a specific sender.
 */
function computeInvitationHtml(senderUserName: string, planTitle: string, planUrl: string) {
  return `
    <h2>${senderUserName} has invited you <a title="${planTitle}" href="${planUrl}" target="_blank" rel="noopener">${planTitle}</a>&nbsp;🎉</h2>
    <p>This message was sent to you by <a title="Grueplan" href="https://grueplan.com" target="_blank" rel="noopener">Grueplan,</a>&nbsp;setup an account to begin planning with your friends!&nbsp;🥂</p>
  `;
}
