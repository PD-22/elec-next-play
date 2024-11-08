import OpenAI from 'openai';
import { z } from 'zod';
import { loadApiKey } from './utils/settingsManager';

const OpenaiMessagesSchema = z.array(
  z.object({
    role: z.string(),
    content: z.string(),
  }),
);
// type OpenaiMessages = z.infer<typeof OpenaiMessagesSchema>;

function fakeResponse(messages: any) {
  const formattedSubtitles = messages[0].content;
  if (typeof formattedSubtitles !== 'string')
    throw new Error('Invalid formattedSubtitles', formattedSubtitles);
  const content = `123${JSON.stringify(
    formattedSubtitles.split('\n').map((_, i) => ({
      startingTime: '00:00',
      title: `title #${i}`,
      summary: `summary #${i}`,
    })),
  )}456`;
  return { choices: [{ message: { content } }] };
}

export default async function requestOpenai(arg: any) {
  const messages = OpenaiMessagesSchema.parse(arg);
  // const messages = arg;

  const apiKey = loadApiKey('OPENAI');
  if (!apiKey) return { error: 'OpenAI API key not found' };
  console.log('openai apiKey', apiKey);

  const openai = new OpenAI({ apiKey });
  const model = 'gpt-4o-mini';

  // // Generate a cache key based on model and body content
  // const cacheKey = generateCacheKey(model, body);
  // // Check if response is cached
  // const cachedResponse = await cache.getCache(cacheKey);
  // if (cachedResponse) {
  //   console.log('Returning cached response');
  //   return cachedResponse;
  // }

  // TEMP: use fake response instead
  try {
    // Make the OpenAI API request if not cached
    const completion = await openai.chat.completions.create({
      model,
      messages: messages as any,
      temperature: 0.7,
      stream: false,
    });

    const completionString = JSON.stringify(completion);
    console.log('[DEBUG] completionString', completionString);
  } catch (error) {
    console.warn('[DEBUG] completionString', error);
  }

  // // Cache the response for future requests
  // await cache.saveCache(cacheKey, completionString);

  // TEMP: fake chatgpt api response
  // return completionString;
  return fakeResponse(messages);
}
