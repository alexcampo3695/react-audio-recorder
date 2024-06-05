import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();

const sendGridApiKey = process.env.SENDGRID_API_KEY;

if (!sendGridApiKey) {
  throw new Error('SENDGRID_API_KEY is not defined in the environment variables');
}

sgMail.setApiKey(sendGridApiKey);

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    filename: string;
    content: string;
    type: string;
    disposition: string;
  }[];
}

interface MailContent {
    type: string;
    value: string;
  }

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const content: { type: string; value: string }[] = [];
  if (options.text) {
    content.push({ type: 'text/plain', value: options.text });
  }
  if (options.html) {
    content.push({ type: 'text/html', value: options.html });
  }
  if (content.length === 0) {
    throw new Error('Email must have at least text or html content');
  }

  const msg = {
    to: options.to,
    from: options.from,
    subject: options.subject,
    content: content as [MailContent, ...MailContent[]], // Ensure content has at least one element
    attachments: options.attachments || [],
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    throw new Error('Email could not be sent');
  }
};
