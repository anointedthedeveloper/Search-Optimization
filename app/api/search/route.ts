import { NextRequest, NextResponse } from 'next/server';

// Search dataset with keywords and profile information
const searchData = [
  {
    id: 1,
    name: 'GitHub - anointedthedeveloper',
    url: 'https://github.com/anointedthedeveloper',
    description: 'GitHub profile of Anointed Agunloye - Web Developer with projects and contributions',
    keywords: ['anointed', 'agunloye', 'anointedthedeveloper', 'anointed the developer', 'github'],
  },
  {
    id: 2,
    name: 'Anobyte - Personal Portfolio',
    url: 'https://anobyte.online',
    description: 'Personal portfolio website and blog of Anointed Agunloye showcasing projects and expertise',
    keywords: ['anobyte', 'anobyte.online', 'anointed', 'agunloye', 'portfolio', 'web developer'],
  },
  {
    id: 3,
    name: 'Anointed Agunloye - Web Developer',
    url: 'https://anobyte.online',
    description: 'Professional profile of Anointed Agunloye, full-stack web developer and creator',
    keywords: ['anointed agunloye', 'agunloye anointed', 'anointed the developer', 'web developer'],
  },
];

const responseHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=3600, s-maxage=3600',
  'X-Content-Type-Options': 'nosniff',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase().trim();

    // Return all results if no query
    if (!query || query.length === 0) {
      return NextResponse.json(
        {
          results: searchData,
          count: searchData.length,
          query: '',
        },
        { headers: responseHeaders }
      );
    }

    // Limit query length to prevent abuse
    if (query.length > 100) {
      return NextResponse.json(
        {
          results: [],
          count: 0,
          query: query.substring(0, 100),
          error: 'Query too long',
        },
        { status: 400, headers: responseHeaders }
      );
    }

    // Filter results based on query matching
    const results = searchData.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(query);
      const matchesDescription = item.description.toLowerCase().includes(query);
      const matchesKeywords = item.keywords.some((keyword) =>
        keyword.toLowerCase().includes(query)
      );

      return matchesName || matchesDescription || matchesKeywords;
    });

    // Sort by relevance (exact matches first)
    const sortedResults = results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === query;
      const bExact = b.name.toLowerCase() === query;

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      // Then by keyword match
      const aKeywordMatch = a.keywords.some((k) => k.toLowerCase() === query);
      const bKeywordMatch = b.keywords.some((k) => k.toLowerCase() === query);

      if (aKeywordMatch && !bKeywordMatch) return -1;
      if (!aKeywordMatch && bKeywordMatch) return 1;

      return 0;
    });

    return NextResponse.json(
      {
        results: sortedResults,
        count: sortedResults.length,
        query,
      },
      { headers: responseHeaders }
    );
  } catch (error) {
    console.error('[Search API Error]', error);
    return NextResponse.json(
      {
        results: [],
        count: 0,
        query: '',
        error: 'Internal server error',
      },
      { status: 500, headers: responseHeaders }
    );
  }
}
