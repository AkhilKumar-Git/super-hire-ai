import { NextResponse } from 'next/server';
import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { Resend } from 'resend';
import { 
  getEmailTemplate, 
  logEmail, 
  EmailLog, 
  EmailTemplate,
  getEmailTemplates,
  saveEmailTemplate
} from '@/lib/storage';

// Initialize OpenAI
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4o',
  temperature: 0.7,
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailRequest {
  candidate: {
    id: string;
    name: string;
    email: string;
    currentRole?: string;
    company?: string;
    skills?: string[];
    summary?: string;
  };
  jobDescription: string;
  subject?: string;
  body?: string;
  templateId?: string;
  fromEmail?: string;
  fromName?: string;
}

export async function POST(request: Request) {
  try {
    const {
      candidate,
      jobDescription,
      subject,
      body,
      templateId,
      fromEmail = 'recruiting@abc-company.com',
      fromName = 'Hiring Team at ABC Company'
    }: EmailRequest = await request.json();

    if (!candidate || !candidate.email) {
      return NextResponse.json(
        { error: 'Candidate email is required' },
        { status: 400 }
      );
    }

    let emailContent = body;
    let emailSubject = subject || 'Exciting Opportunity at ABC Company';

    // If templateId is provided, fetch the template
    if (templateId) {
      const template = await getEmailTemplate(templateId);
      if (template) {
        emailContent = template.body;
        emailSubject = template.subject;
      }
    }

    // If no body or template provided, generate one with AI
    if (!emailContent) {
      const template = `
      Create a personalized recruiting email for a potential candidate.
      
      Candidate Information:
      - Name: {name}
      - Current Role: {currentRole}
      - Current Company: {company}
      - Skills: {skills}
      - Background: {background}
      
      Job Description:
      {jobDescription}
      
      Write a concise, compelling email (under 200 words) that:
      1. Opens with a personalized greeting
      2. References the candidate's specific background and achievements
      3. Explains why they would be a great fit for the role
      4. Includes a clear call to action
      5. Closes professionally
      
      The tone should be professional but warm, and should feel personalized rather than generic.
      `;
      
      const prompt = PromptTemplate.fromTemplate(template);
      const chain = prompt.pipe(model);
      emailContent = await chain.invoke({
        name: candidate.name,
        currentRole: candidate.currentRole || 'their current role',
        company: candidate.company || 'their current company',
        skills: candidate.skills?.join(', ') || 'various skills',
        background: candidate.summary || 'their background',
        jobDescription: jobDescription || 'an exciting opportunity',
      });
    }

    // Send email using Resend
    let sendResult;
    let emailStatus: EmailLog['status'] = 'SENT';
    let errorDetails: any = null;

    try {
      const result = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: "akhi.the.techie@gmail.com",
        subject: emailSubject,
        html: emailContent,
      });
      
      if (result.error) {
        throw result.error;
      }
      
      sendResult = result.data;
    } catch (error) {
      console.error('Error sending email:', error);
      emailStatus = 'FAILED';
      errorDetails = error;
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to send email', 
          details: error 
        },
        { status: 500 }
      );
    } finally {
      // Log the email regardless of success/failure
      try {
        await logEmail({
          to: candidate.email,
          subject: emailSubject,
          content: emailContent,
          status: emailStatus,
          candidateId: candidate.id,
          metadata: {
            error: errorDetails,
            result: sendResult
          }
        });
      } catch (logError) {
        console.error('Error logging email:', logError);
        // Continue even if logging fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      data: sendResult 
    });
  } catch (error) {
    console.error('Email generation/sending error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'An error occurred while processing the email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Add GET endpoint to list email templates
export async function GET() {
  try {
    const templates = await getEmailTemplates();
    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch email templates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
