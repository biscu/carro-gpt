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
    model: openai.chat('gpt-4o'),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    
    // Adjusted parameters for better knowledge base fidelity
    temperature: 0.1,        // Lower temperature for more deterministic, focused responses
    topP: 0.8,              // Slightly restrictive nucleus sampling
    presencePenalty: 0.3,   // Encourage using information from knowledge base
    frequencyPenalty: 0.1,  // Light penalty to avoid excessive repetition
    maxOutputTokens: 1000,  // Control response length
    
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
        description: `Search the knowledge base for relevant information. Always use this before answering questions. Return the exact content found, including specific phrases and terminology.`,
        inputSchema: z.object({
          question: z.string().describe('The user\'s question to search for'),
          includeExactPhrases: z.boolean().default(true).describe('Whether to prioritize exact phrases from the knowledge base')
        }),
        execute: async ({ question, includeExactPhrases }) => {
          const content = await findRelevantContent(question);
          // You might want to modify findRelevantContent to return more exact matches
          return content;
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}