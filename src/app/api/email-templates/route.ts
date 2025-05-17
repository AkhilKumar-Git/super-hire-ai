import { NextResponse } from 'next/server';
import { 
  getEmailTemplates, 
  saveEmailTemplate, 
  deleteEmailTemplate as deleteTemplate,
  EmailTemplate 
} from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const { name, subject, body, isDefault = false } = await req.json();
    
    if (!name || !subject || !body) {
      return NextResponse.json(
        { success: false, error: 'Name, subject, and body are required' },
        { status: 400 }
      );
    }
    
    const template = await saveEmailTemplate({
      name,
      subject,
      body,
      isDefault
    });
    
    return NextResponse.json({ 
      success: true, 
      data: template 
    });
  } catch (error) {
    console.error('Error creating/updating email template:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save email template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const templates = await getEmailTemplates();
    return NextResponse.json({ 
      success: true, 
      data: templates 
    });
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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      );
    }
    
    await deleteTemplate(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Template deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting email template:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete email template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
