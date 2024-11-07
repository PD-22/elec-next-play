// TODO: remove comments. test api

// app/api/perplexity/route.ts

// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers'; // Use next/headers for server-side cookie access
// import { PerplexityApiClient } from '../../../utils/perplexityApiClient';
// import { FileStringCache } from '../../../utils/fileStringCache';

export default async function perplexity(
  Question: string,
  Instruction?: string,
): Promise<{ error: string } | { result: string }> {
  try {
    const query = { Question, Instruction };

    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 300);
    });

    // Retrieve the API key using the settingsManager (server-side)
    // const cookieStore = cookies(); // Access the cookies on the server-side
    // const apiKey = loadApiKeyServer('PERPLEXITY', cookieStore);
    const apiKey = undefined;

    // Log API key retrieval
    if (!apiKey) {
      console.error('API key is missing in cookies');
      return { error: 'API key is missing in cookies' };
    }
    return { result: JSON.stringify(query) };
    // console.log('Retrieved API key from cookies.');

    // // Initialize the PerplexityApiClient with the retrieved API key
    // const cache = new FileStringCache('PerplexityCache', '', '', true);
    // const perplexityApiClient = new PerplexityApiClient(apiKey);

    // // Log that we're making the API call
    // console.log(
    //   `Calling Perplexity API with question: "${query.Question}" and instruction: "${query.Instruction || ''}"`,
    // );

    // // Fetch the response from the Perplexity API
    // const retVal = await perplexityApiClient.getChatCompletionAsync(
    //   query.Instruction || '', // Use instruction if provided
    //   query.Question,
    // );

    // // Log the successful result
    // console.log('Perplexity API responded with:', retVal);

    // // Return the result as JSON
    // return NextResponse.json({ result: retVal });
  } catch (error: any) {
    console.error(`Error processing Perplexity query: ${error.message}`, error);
    return { error: `An error occurred: ${error.message}` };
  }
}
