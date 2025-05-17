import { NextResponse } from 'next/server';
import { 
  createList, 
  getLists, 
} from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'List name is required' },
        { status: 400 }
      );
    }
    
    const list = await createList({ name, description });
    
    return NextResponse.json({ 
      success: true, 
      data: list 
    });
  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create list',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const lists = await getLists();
    
    // Enrich lists with candidate counts
    const listsWithCounts = lists.map(list => ({
      ...list,
      _count: {
        candidates: list.candidateIds.length
      }
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: listsWithCounts 
    });
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch lists',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
