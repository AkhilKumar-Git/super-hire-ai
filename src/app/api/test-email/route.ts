import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const toEmail = 'akhi.the.techie@gmail.com';
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Hire AI <onboarding@resend.dev>',
      to: [toEmail],
      subject: 'Test Email from Hire AI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Hello from Hire AI! 👋</h1>
          <p>This is a test email sent from the Hire AI application.</p>
          <p>If you're receiving this, the email functionality is working correctly!</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p>Best regards,<br/>The Hire AI Team</p>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending test email:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to send test email', 
          details: error 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      data 
    });

  } catch (error) {
    console.error('Unexpected error sending test email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'An unexpected error occurred while sending test email',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
