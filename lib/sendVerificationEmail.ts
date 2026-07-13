import { resend } from '@/lib/resend';
import { ApiResponse } from '@/types/ApiResponse';
import htmlPara from '../utils/emailFormat';

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

  // 1. Guard check {TEMP}: Handle Resend sandbox restriction for unverified accounts
  const verifiedTestRecipient = process.env.RESEND_VERIFIED_TO_EMAIL!;

  if (
    !verifiedTestRecipient //if not  present , then skip this check
    && verifiedTestRecipient.toLowerCase() !== email.toLowerCase() //if present then should not be mohit
  ) {
    const warnMsg = `Resend test mode restricted: target email "${email}" does not match the verified sandbox recipient "${verifiedTestRecipient}".`;
    console.warn(`WARN; Email send skipped for free api : ${warnMsg}`);
    return {
      success: false,
      message: warnMsg,
    };
  }

  //NOTE: IF on Production
  try {
    //from resend free trail | docs
    const fromEmail = process.env.RESEND_FROM_EMAIL!

    const emailSubject = 'Mystery Message | Verification Code';

    // 2. calling html giver // MESSAGE PRODUCE
    const htmlContent = htmlPara(username, verifyCode);

    // 3. Dispatch email using Resend API and HTML body
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: verifiedTestRecipient ?? email,
      subject: emailSubject,
      html: htmlContent,
    });

    if (error) {
      console.error(`ERROR; Resend API responded with an error for recipient ${email}:`, error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred while sending email.',
      };
    }

    console.log(`SUCCESS; Verification email successfully sent. Response: ${JSON.stringify(data)}`);
    return {
      success: true,
      message: "Verification email sent successfully.",
    };

  } catch (emailError) {
    console.error(`ERROR; Unexpected exception thrown during email dispatch to ${email}:`, emailError);
    return {
      success: false,
      message: emailError instanceof Error ? emailError.message : String(emailError),
    };
  }
}


