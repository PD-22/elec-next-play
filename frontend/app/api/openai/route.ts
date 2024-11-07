import { OpenAI } from 'openai';
import { loadApiKeyServer } from '../../../utils/settingsManager';
import { cookies } from 'next/headers';
import { FileStringCache } from '../../../utils/fileStringCache';

const cache = new FileStringCache('openaiResponsesCache', './cache', 'openai', true);

// Simple hash function for generating unique keys
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

function generateCacheKey(model: string, body: any): string {
  const dataToHash = JSON.stringify({ model, body });
  console.log(body)
  return simpleHash(dataToHash);
}

export async function POST(request: Request) {
  try {
    const apiKey = loadApiKeyServer('OPENAI', cookies());
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not found' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const openai = new OpenAI({ apiKey });
    const body = await request.json();
    const { messages } = body;
    const model = "gpt-4o-mini";

    // Generate a cache key based on model and body content
    const cacheKey = generateCacheKey(model, body);

    // Check if response is cached
    const cachedResponse = await cache.getCache(cacheKey);
    if (cachedResponse) {
      console.log('Returning cached response');
      return new Response(cachedResponse, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Make the OpenAI API request if not cached
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      stream: false,
    });

    const completionString = JSON.stringify(completion);

    // Cache the response for future requests
    await cache.saveCache(cacheKey, completionString);

    return new Response(completionString, {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
