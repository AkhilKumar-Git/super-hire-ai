import { NextResponse } from 'next/server';
import { 
  getEmailTemplate, 
  saveEmailTemplate, 
  deleteEmailTemplate,
  EmailTemplate
} from '@/lib/storage';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await getEmailTemplate(params.id);

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: template 
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, subject, body, isDefault } = await req.json();
    
    // Get the existing template first to preserve any fields not being updated
    const existingTemplate = await getEmailTemplate(params.id);
    if (!existingTemplate) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }
    
    // Update the template with new values
    const updatedTemplate = await saveEmailTemplate({
      ...existingTemplate,
      name: name ?? existingTemplate.name,
      subject: subject ?? existingTemplate.subject,
      body: body ?? existingTemplate.body,
      isDefault: isDefault ?? existingTemplate.isDefault
    }, params.id);

    return NextResponse.json({ 
      success: true, 
      data: updatedTemplate 
    });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteEmailTemplate(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
