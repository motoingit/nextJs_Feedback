import { Resend } from 'resend';

export const resend = new Resend(process.env.VERIFICATION_MESSAGE_SENDER_API_KEY);
