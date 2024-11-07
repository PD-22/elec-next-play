// TODO: uncomment

// import fetch from 'node-fetch';

// export class PerplexityApiClient {
//   private apiKey: string;

//   constructor(apiKey: string) {
//     this.apiKey = apiKey;
//   }

//   private constructApiRequest(instruction: string, question: string) {
//     const apiUrl = 'https://api.perplexity.ai/chat/completions';

//     const requestBody = {
//       model: 'llama-3.1-sonar-small-128k-online',
//       messages: [
//         { role: 'system', content: instruction },
//         { role: 'user', content: question }
//       ],
//       max_tokens: 150,
//     };

//     const headers = {
//       'Authorization': `Bearer ${this.apiKey}`,
//       'Content-Type': 'application/json',
//     };

//     console.log('Constructed API request:', { apiUrl, requestBody, headers });

//     return {
//       apiUrl,
//       requestBody,
//       headers,
//     };
//   }

//   public async getChatCompletionAsync(instruction: string, question: string): Promise<string> {
//     const { apiUrl, requestBody, headers } = this.constructApiRequest(instruction, question);

//     try {
//       console.log('Sending API request to Perplexity:', { apiUrl, requestBody, headers });
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: headers,
//         body: JSON.stringify(requestBody),
//       });

//       const rawText = await response.text();
//       console.log('Raw response from Perplexity API:', rawText);

//       if (!response.ok) {
//         console.error('Perplexity API responded with error:', rawText);
//         throw new Error(`Perplexity API error: ${response.statusText}`);
//       }

//       const data = JSON.parse(rawText);
//       const result = data.choices[0].message.content || 'No result returned from Perplexity API';

//       console.log('Perplexity API returned data:', data);

//       return result;
//     } catch (error: any) {
//       console.error(`Failed to fetch completion from Perplexity API: ${error.message}`, error);
//       throw new Error(`Failed to fetch completion from Perplexity API: ${error.message}`);
//     }
//   }
// }
