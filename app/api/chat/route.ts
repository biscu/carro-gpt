import { createResource } from '@/lib/actions/resources';
import { systemPrompt } from '@/lib/ai/systemPrompt';
import { openai } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  streamText,
  tool,
  UIMessage,
  stepCountIs,
} from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai.chat('gpt-4',),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    system: systemPrompt,
    tools: {
      addResource: tool({
        description: `Add a new resource to the knowledge base. Only use this when explicitly asked to add new information.`,
        inputSchema: z.object({
          content: z.string().describe('The content to add to the knowledge base')
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `Search the knowledge base for relevant information. Always use this before answering questions.`,
        inputSchema: z.object({
          question: z.string().describe('The user\'s question to search for')
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}