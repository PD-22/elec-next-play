import fetch from 'node-fetch';

export class PerplexityApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private constructApiRequest(instruction: string, question: string) {
    const apiUrl = 'https://api.perplexity.ai/chat/completions';

    const requestBody = {
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        { role: 'system', content: instruction },
        { role: 'user', content: question }
      ],
      max_tokens: 150,
    };

    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    console.log('Constructed API request:', { apiUrl, requestBody, headers });

    return {
      apiUrl,
      requestBody,
      headers,
    };
  }

  public async getChatCompletionAsync(instruction: string, question: string): Promise<string> {
    const { apiUrl, requestBody, headers } = this.constructApiRequest(instruction, question);

    try {
      console.log('Sending API request to Perplexity disabled');
      return;
    } catch (error: any) {
      console.error(`Failed to fetch completion from Perplexity API: ${error.message}`, error);
      throw new Error(`Failed to fetch completion from Perplexity API: ${error.message}`);
    }
  }
}