// app/api/perplexity/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Use next/headers for server-side cookie access
import { PerplexityApiClient } from '../../../utils/perplexityApiClient';
import { FileStringCache } from '../../../utils/fileStringCache';
import { loadApiKeyServer } from '../../../utils/settingsManager'; // Server-side imports

interface PerplexityQuery {
  Question: string;
  Instruction?: string;
}

export async function POST(req: Request) {
  try {
    // Log incoming request details
    console.log('Incoming request to /api/perplexity');
    
    const query: PerplexityQuery = await req.json();
    console.log('Parsed request body:', query);

    // Retrieve the API key using the settingsManager (server-side)
    const cookieStore = cookies(); // Access the cookies on the server-side
    const apiKey = loadApiKeyServer('PERPLEXITY', cookieStore);

    // Log API key retrieval
    if (!apiKey) {
      console.error('API key is missing in cookies');
      return NextResponse.json({ error: 'API key is missing in cookies' }, { status: 400 });
    }
    console.log('Retrieved API key from cookies.');

    // Initialize the PerplexityApiClient with the retrieved API key
    const cache = new FileStringCache("PerplexityCache", "", "", true);
    const perplexityApiClient = new PerplexityApiClient(apiKey);

    // Log that we're making the API call
    console.log(`Calling Perplexity API with question: "${query.Question}" and instruction: "${query.Instruction || ''}"`);

    // Fetch the response from the Perplexity API
    const retVal = await perplexityApiClient.getChatCompletionAsync(
      query.Instruction || "",  // Use instruction if provided
      query.Question
    );

    // Log the successful result
    console.log('Perplexity API responded with:', retVal);

    // Return the result as JSON
    return NextResponse.json({ result: retVal });
  } catch (error: any) {
    console.error(`Error processing Perplexity query: ${error.message}`, error);
    return NextResponse.json({ error: `An error occurred: ${error.message}` }, { status: 500 });
  }
}
