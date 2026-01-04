import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMagicLinkEmail(email: string, token: string, code?: string) {
  const magicLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Interview Accelerator <jc@engineermycareer.com>',
    to: email,
    subject: code ? `Your login code: ${code}` : 'Your Interview Accelerator Login Link',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login to Interview Accelerator</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #0284c7; font-size: 24px; margin: 0 0 24px 0;">
              Interview Accelerator
            </h1>
            
            ${code ? `
            <div style="background-color: #f0f9ff; border-radius: 8px; padding: 24px; margin: 0 0 24px 0; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Your login code:</p>
              <p style="color: #0284c7; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">${code}</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Enter this code on the login page, or click the button below. Expires in 15 minutes.
            </p>
            ` : `
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Click the button below to log in to your Interview Accelerator account. This link will expire in 15 minutes.
            </p>
            `}
            
            <a href="${magicLink}" style="display: inline-block; background-color: #0284c7; color: white; font-weight: 600; font-size: 16px; padding: 14px 28px; border-radius: 8px; text-decoration: none;">
              Log In to Your Account
            </a>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 32px 0 0 0;">
              If you didn't request this email, you can safely ignore it.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${magicLink}" style="color: #0284c7; word-break: break-all;">${magicLink}</a>
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send magic link email:', error);
    throw new Error('Failed to send login email');
  }

  return data;
}

export async function sendWelcomeEmail(email: string, name: string, tier: string) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Interview Accelerator <jc@engineermycareer.com>',
    to: email,
    subject: 'Welcome to Interview Accelerator! 🚀',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Interview Accelerator</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #0284c7; font-size: 24px; margin: 0 0 24px 0;">
              Welcome to Interview Accelerator! 🎉
            </h1>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
              Hi ${name || 'there'},
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Your <strong>${tier}</strong> account is now active. You're about to embark on a 14-day journey to land your dream job.
            </p>
            
            <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin: 0 0 24px 0;">
              <p style="color: #0369a1; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">
                What's next?
              </p>
              <ul style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Day 1: Define who you are professionally</li>
                <li>Day 2: Clarify what you want in your next role</li>
                <li>Days 3-14: Build your job search engine</li>
              </ul>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Each day takes about 30 minutes. Consistency is key!
            </p>
            
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background-color: #0284c7; color: white; font-weight: 600; font-size: 16px; padding: 14px 28px; border-radius: 8px; text-decoration: none;">
              Start Day 1 Now
            </a>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Questions? Reply to this email and we'll help you out.
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw - welcome email is not critical
  }

  return data;
}
