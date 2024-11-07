import { loadApiKey } from './utils/settingsManager';

export default async function perplexity(
  Question: string,
  Instruction?: string,
): Promise<{ error: string } | { result: string }> {
  try {
    const query = { Question, Instruction };

    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 300);
    });

    // Retrieve the API key using the settingsManager
    const apiKey = loadApiKey('PERPLEXITY');

    // Log API key retrieval
    if (!apiKey) {
      console.error('API key is missing in cookies');
      return { error: 'API key is missing in cookies' };
    }
    console.log('Retrieved API key.');

    // TEMP: remove the fake api
    // Initialize the PerplexityApiClient with the retrieved API key
    // import PerplexityApiClient from './utils/perplexityApiClient';
    // const perplexityApiClient = new PerplexityApiClient(apiKey);
    const perplexityApiClient = {
      getChatCompletionAsync: async (i: string, q: string) =>
        [`Fake response`, `Instruction: ${i}`, `Question: ${q}`].join('\n|\n'),
    };

    // Log that we're making the API call
    console.log(
      `Calling Perplexity API with question: "${query.Question}" and instruction: "${query.Instruction || ''}"`,
    );

    // Fetch the response from the Perplexity API
    const retVal = await perplexityApiClient.getChatCompletionAsync(
      query.Instruction || '', // Use instruction if provided
      query.Question,
    );

    // Log the successful result
    console.log('Perplexity API responded with:', retVal);

    return { result: retVal };
  } catch (error: any) {
    console.error(`Error processing Perplexity query: ${error.message}`, error);
    return { error: `An error occurred: ${error.message}` };
  }
}
