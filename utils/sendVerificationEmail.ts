import React from 'react';
import VerificationEmail from '@/components/email/VerificationEmail';
import { resend } from '@/lib/resend';
import { ApiResponse } from '@/types/ApiResponse';

/* Dispatches a verification email using the Resend service.
 * 
 * @param email - Target recipient email address.
 * @param username - Username of the recipient to display in the email.
 * @param verifyCode - The 6-digit OTP verification code.
 * @returns An ApiResponse indicating success or details about the failure.
 */
export default async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> { 
  console.log(`📧 Initiating verification email dispatch to: ${email} (username: ${username})`);

  // 1. Guard check: Handle Resend sandbox restriction for unverified accounts
  const verifiedTestRecipient = process.env.RESEND_VERIFIED_TO_EMAIL;

  if (
    verifiedTestRecipient && 
    email.toLowerCase() !== verifiedTestRecipient.toLowerCase()
  ) {
    const warnMsg = `Resend test mode restricted: target email "${email}" does not match the verified sandbox recipient "${verifiedTestRecipient}".`;
    console.warn(`⚠️ Email send skipped: ${warnMsg}`);
    return {
      success: false,
      message: warnMsg,
    };
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const emailSubject = 'Mystery Message | Verification Code';

    // 3. Dispatch email using Resend API and React email template
    const { data, error } = await resend.emails.send({
      from: fromEmail,

      //WARN: Hardcoded email address for now****************
      
      to: "mohitsinghinsecondary@gmail.com",
      subject: emailSubject,
      react: React.createElement(VerificationEmail, { username, otp: verifyCode }),
    });

    if (error) {
      console.error(`⚠️ Resend API responded with an error for recipient ${email}:`, error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred while sending email.',
      };
    }

    console.log(`✅ Verification email successfully sent. Response:`, JSON.stringify(data));
    return {
      success: true,
      message: "Verification email sent successfully.",
    };

  } catch (emailError) {
    console.error(`❌ Unexpected exception thrown during email dispatch to ${email}:`, emailError);
    return {
      success: false,
      message: emailError instanceof Error ? emailError.message : String(emailError),
    };
  }
}


