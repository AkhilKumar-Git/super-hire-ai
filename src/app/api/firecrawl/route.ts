import { NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';

export async function POST(request: Request) {
  try {
    const { query, options = {} } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Initialize Firecrawl with API key from environment variables
    const app = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY || ''
    });

    // Default options
    const searchOptions = {
      limit: 5,
      pageContent: true,
      scrapeOptions: {
        onlyMainContent: true
      },
      ...options
    };
    
    // Remove any undefined options that might come from the client
    if (searchOptions.scrapeOptions) {
      Object.keys(searchOptions.scrapeOptions).forEach(key => {
        if (searchOptions.scrapeOptions[key] === undefined) {
          delete searchOptions.scrapeOptions[key];
        }
      });
    }

    // Perform the search
    const searchResult = await app.search(query, searchOptions);
    
    return NextResponse.json({
      success: true,
      data: searchResult.data
    });

  } catch (error) {
    console.error('Firecrawl API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform search',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
