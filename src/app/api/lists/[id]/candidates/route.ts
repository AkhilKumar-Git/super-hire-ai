import { NextResponse } from 'next/server';
import { 
  getList, 
  addCandidatesToList, 
  removeCandidatesFromList,
  getCandidatesByIds
} from '@/lib/storage';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { candidateIds } = await req.json();
    
    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one candidate ID is required' },
        { status: 400 }
      );
    }

    // Check if list exists
    const list = await getList(params.id);
    if (!list) {
      return NextResponse.json(
        { success: false, error: 'List not found' },
        { status: 404 }
      );
    }

    // Add candidates to list
    const updatedList = await addCandidatesToList(params.id, candidateIds);
    
    // Get full candidate objects
    const candidates = await getCandidatesByIds(updatedList.candidateIds);

    return NextResponse.json({ 
      success: true, 
      data: {
        ...updatedList,
        candidates
      } 
    });
  } catch (error) {
    console.error('Error adding candidates to list:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to add candidates to list',
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
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get('candidateId');

    if (!candidateId) {
      return NextResponse.json(
        { success: false, error: 'Missing candidateId parameter' },
        { status: 400 }
      );
    }

    // Check if list exists
    const list = await getList(params.id);
    if (!list) {
      return NextResponse.json(
        { success: false, error: 'List not found' },
        { status: 404 }
      );
    }

    // Remove candidates from list
    const updatedList = await removeCandidatesFromList(params.id, [candidateId]);
    
    // Get full candidate objects
    const candidates = await getCandidatesByIds(updatedList.candidateIds);

    return NextResponse.json({ 
      success: true, 
      data: {
        ...updatedList,
        candidates
      } 
    });
  } catch (error) {
    console.error('Error removing candidates from list:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to remove candidates from list',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
