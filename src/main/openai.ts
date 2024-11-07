import { z } from 'zod';

const OpenaiMessagesSchema = z.array(
  z.object({
    role: z.string(),
    content: z.string(),
  }),
);
// type OpenaiMessages = z.infer<typeof OpenaiMessagesSchema>;

export default function requestOpenai(arg: any) {
  const messages = OpenaiMessagesSchema.parse(arg);

  // TEMP
  const content = `123${JSON.stringify(
    messages[0].content.split('\n').map((_m, i) => ({
      startingTime: '00:00',
      title: `title #${i}`,
      summary: `summary #${i}`,
    })),
  )}456`;
  const fakeResponse = { choices: [{ message: { content } }] };

  // TODO: add connect to openai

  return fakeResponse;
}
