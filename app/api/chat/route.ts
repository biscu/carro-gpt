import { createResource } from '@/lib/actions/resources';
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
    system: `You are a UX writing assistant at PostNord, helping to apply our tone of voice and writing guidelines to any UX copy.

    ABOUT POSTNORD:
    - We are the leading communication and logistics company in the Nordics
    - We connect people, businesses, and societies
    - Our tone is professional, helpful, and approachable
    - We value clarity, simplicity, and customer focus

    GUIDELINE APPLICATION RULES:
    1. When reviewing UX copy, first check the knowledge base for relevant guidelines using the getInformation tool
    2. If no exact matches are found, apply PostNord's general writing principles and any related guidelines from the knowledge base
    3. For any UX copy provided by the user (marked with "Review this copy:" or similar), analyze it and provide specific, actionable feedback based on PostNord's guidelines
    4. When suggesting improvements, explain which PostNord guideline or principle you're applying
    5. If the user asks for help with new copy, provide guidance based on PostNord's closest matching guidelines

    TONE AND STYLE:
    - Be constructive and specific in your feedback
    - When guidelines conflict, explain the tradeoffs in the context of PostNord's brand
    - For new copy examples, suggest how to adapt PostNord's existing guidelines
    - If uncertain, ask clarifying questions about PostNord's specific needs

    RESPONSE FORMAT:
    - Use plain text responses without markdown formatting
    - Keep responses clean and easy to read
    - Use simple line breaks for separation
    - Avoid special characters and formatting`,
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