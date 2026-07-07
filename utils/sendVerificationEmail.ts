import VerificationEmail from '@/components/email/VerificationEmail';
import { resend } from '@/lib/resend';
import { ApiResponse } from '@/types/ApiResponse';


export async function sendVefificationEmail(
  email:string,
  username:string,
  verifyCode:string,
): Promise<ApiResponse> {

  try {
    //todo: Some is hardcoded
    const { data, error } = await resend.emails.send({
      // from: 'Acme <onboarding@resend.dev>',
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Mystry message| Verification',
      //? this is funition teachnicaly althoug component
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });

    //* The API responded, but with an error
    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Verification email sent successfully.",
    };

  } catch (emailError) {
    //* An exception was thrown - when somthing wrong in the path
    return {
      success: false,
      message:
        emailError instanceof Error ? emailError.message : "Unknown error",
    };
  }
}
