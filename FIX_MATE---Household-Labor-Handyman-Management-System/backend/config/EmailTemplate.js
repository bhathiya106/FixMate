export const PASSWORD_RESET_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FIXMATE Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f7fa;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin: 40px auto;">
    <tr>
      <td style="background-color: #1e40af; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">FIXMATE</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 20px; text-align: center;">
        <h2 style="color: #1e40af; font-size: 22px; margin: 0 0 20px;">Forgot Your Password?</h2>
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          We received a request to reset the password for your FIXMATE account associated with <strong>{{email}}</strong>.
        </p>
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          Use this OTP to reset your password:
        </p>
        <div style="background-color: #dbeafe; padding: 15px; border-radius: 6px; display: inline-block; margin: 20px 0;">
          <h3 style="color: #1e40af; font-size: 24px; font-weight: bold; margin: 0;">{{otp}}</h3>
        </div>
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          Enter this OTP on the password reset page to create a new password.
        </p>
        <p style="color: #dc2626; font-size: 14px; font-weight: bold; margin: 20px 0 0;">
          This password reset OTP is only valid for the next 15 minutes.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f1f5f9; padding: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">
          If you didn’t request a password reset, please ignore this email or contact our support team at <a href="mailto:support@fixmate.com" style="color: #1e40af; text-decoration: none;">support@fixmate.com</a>.
        </p>
        <p style="color: #64748b; font-size: 12px; margin: 10px 0 0;">
          &copy; 2025 FIXMATE. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`

export const EMAIL_VERIFY_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FIXMATE Email Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f7fa;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin: 40px auto;">
    <tr>
      <td style="background-color: #1e40af; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">FIXMATE</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 20px; text-align: center;">
        <h2 style="color: #1e40af; font-size: 22px; margin: 0 0 20px;">Verify Your Email Address</h2>
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          You're almost there! We've sent this email to <strong>{{email}}</strong> to verify your account.
        </p>
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          Verify your account using this OTP:
        </p>
        <div style="background-color: #dbeafe; padding: 15px; border-radius: 6px; display: inline-block; margin: 20px 0;">
          <h3 style="color: #1e40af; font-size: 24px; font-weight: bold; margin: 0;">{{otp}}</h3>
        </div>
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          Enter this OTP on the verification page to activate your FIXMATE account.
        </p>
        <p style="color: #dc2626; font-size: 14px; font-weight: bold; margin: 20px 0 0;">
          This verification OTP is only valid for the next 15 minutes.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f1f5f9; padding: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">
          If you didn’t sign up for a FIXMATE account, please ignore this email or contact our support team at <a href="mailto:support@fixmate.com" style="color: #1e40af; text-decoration: none;">support@fixmate.com</a>.
        </p>
        <p style="color: #64748b; font-size: 12px; margin: 10px 0 0;">
          &copy; 2025 FIXMATE. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
