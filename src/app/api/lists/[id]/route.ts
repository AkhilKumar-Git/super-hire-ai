import { NextResponse } from 'next/server';
import { 
  getList, 
  getCandidatesByIds, 
  updateList, 
  deleteList,
  CandidateList,
  Candidate
} from '@/lib/storage';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const list = await getList(params.id);

    if (!list) {
      return NextResponse.json(
        { success: false, error: 'List not found' },
        { status: 404 }
      );
    }

    // Get the full candidate objects
    const candidates = await getCandidatesByIds(list.candidateIds);

    return NextResponse.json({ 
      success: true, 
      data: {
        ...list,
        candidates
      } 
    });
  } catch (error) {
    console.error('Error fetching list:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch list',
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
    const { name, description, candidateIds } = await req.json();
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'List name is required' },
        { status: 400 }
      );
    }
    
    const list = await updateList(params.id, { name, description, candidateIds });

    return NextResponse.json({ 
      success: true, 
      data: list 
    });
  } catch (error) {
    console.error('Error updating list:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update list',
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
    await deleteList(params.id);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting list:', error);
    return NextResponse.json(
      { error: 'Failed to delete list' },
      { status: 500 }
    );
  }
}
