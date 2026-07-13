
const htmlPara = (username: string, otp: string)=>{
  return `
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
            <div class="code-box">${otp}</div>
            <p>If you did not request this code, please ignore this email.</p>
            <div class="footer">
              This is an automated message from Mystery Message. Please do not reply to this email.
            </div>
          </div>
        </body>
      </html>
    `;
}

export default htmlPara;
