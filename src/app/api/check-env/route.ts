import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    hasFirecrawlKey: !!process.env.FIRECRAWL_API_KEY,
    nodeEnv: process.env.NODE_ENV,
  };

  return NextResponse.json({
    success: true,
    message: 'Environment check complete',
    env: envVars,
    instructions: !envVars.hasResendKey ? 
      'To send emails, please set the RESEND_API_KEY in your environment variables.' :
      'Resend API key is configured.'
  });
}
