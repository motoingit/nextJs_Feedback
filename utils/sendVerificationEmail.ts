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

  // 1. Guard check {TEMP}: Handle Resend sandbox restriction for unverified accounts
  const verifiedTestRecipient = process.env.RESEND_VERIFIED_TO_EMAIL;

  if (
    verifiedTestRecipient //if not  present , then skip this check
    && verifiedTestRecipient.toLowerCase() !== email.toLowerCase() //if present then should not be mohit
  ) {
    const warnMsg = `Resend test mode restricted: target email "${email}" does not match the verified sandbox recipient "${verifiedTestRecipient}".`;
    console.warn(`⚠️ Email send skipped for free api : ${warnMsg}`);
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

    // 2. Build lightweight inline HTML email template to avoid importing react-email compilation overhead
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Verification Code</title>
          <style>
            body {
              font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
              background-color: #f9f9f9;
              color: #333333;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              background-color: #ffffff;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 24px;
              margin: 0 auto;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            h2 {
              color: #111111;
              font-size: 20px;
              margin-top: 0;
            }
            .code-box {
              background-color: #f0f0f0;
              border-radius: 4px;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 2px;
              padding: 12px;
              text-align: center;
              margin: 20px 0;
              color: #2563eb;
            }
            p {
              line-height: 1.6;
              font-size: 15px;
            }
            .footer {
              font-size: 13px;
              color: #888888;
              margin-top: 24px;
              border-top: 1px solid #eeeeee;
              padding-top: 16px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Hello ${username},</h2>
            <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
            <div class="code-box">${verifyCode}</div>
            <p>If you did not request this code, please ignore this email.</p>
            <div class="footer">
              This is an automated message from Mystery Message. Please do not reply to this email.
            </div>
          </div>
        </body>
      </html>
    `;

    // 3. Dispatch email using Resend API and HTML body
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      //WARN: if x is null then email {PRODUCITON}
      to: verifiedTestRecipient ?? email,
      subject: emailSubject,
      html: htmlContent,
    });

    if (error) {
      console.error(`⚠️ Resend API responded with an error for recipient ${email}:`, error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred while sending email.',
      };
    }

    console.log(`%c[SUCCESS] > Verification email successfully sent. Response: ${JSON.stringify(data)}`, 'color: green;');
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


