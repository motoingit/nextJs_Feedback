import VerificationEmail from '@/components/email/VerificationEmail';
import { resend } from '@/lib/resend';
import { ApiResponse } from '@/types/ApiResponse';


/**
 * Dispatches a verification email using the Resend service.
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
  console.log(`📧 Attempting to dispatch verification email to: ${email} (username: ${username})`);

  try {
    // Send email via Resend API using the React component template
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Mystery Message | Verification Code',
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });

    // The API responded with an error (e.g. invalid key, invalid domain, etc.)
    if (error) {
      console.error(`⚠️ Resend API responded with an error for ${email}:`, error);
      return {
        success: false,
        message: error.message,
      };
    }

    // Success response contains mail transaction details (e.g. id)
    console.log(`✅ Verification email successfully sent. Response payload:`, JSON.stringify(data));

    return {
      success: true,
      message: "Verification email sent successfully.",
    };

  } catch (emailError) {
    // Catch-all block for network issues or exception throws
    console.error(`❌ Unexpected exception thrown during email dispatch to ${email}:`, emailError);
    return {
      success: false,
      message:
        emailError instanceof Error ? emailError.message : String(emailError),
    };
  }
}

