import { type NextRequest, NextResponse } from "next/server"
import { Anthropic } from '@anthropic-ai/sdk';
import { MessageParam } from "@anthropic-ai/sdk/resources/messages.mjs";
import { systemPrompt } from "@/app/api/refactor/constants";

function processRefactoredCode(text: string): string {
  const outputLines = text.split('\n');
  return outputLines.length > 2 
    ? outputLines.slice(1, -1).join('\n')
    : text;
}

async function handleStreamingRequest(
  anthropic: Anthropic,
  messages: MessageParam[],
  system: string
) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const stream = await anthropic.messages.stream({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 1024,
          messages,
          system: system
        })

        let accumulatedText = "";

        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            accumulatedText += event.delta.text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: event.delta.text })}\n\n`));
          }
        }

        const refactoredCode = processRefactoredCode(accumulatedText);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, refactoredCode })}\n\n`));
        controller.close();
      } catch (error) {
        console.error("Error in streaming:", error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Failed to refactor code - internal server error" })}\n\n`));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

async function handleTraditionalRequest(
  anthropic: Anthropic,
  messages: MessageParam[],
  system: string
) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    messages,
    system: system
  })

  const contentBlock = response.content[0];
  const output = (typeof contentBlock === 'object' && 'text' in contentBlock)
    ? contentBlock.text
    : JSON.stringify(contentBlock, null, 2);

  const refactoredCode = processRefactoredCode(output);
  return NextResponse.json({ refactoredCode });
}

export async function POST(request: NextRequest) {
  try {
    const { code, stream: useStream } = await request.json()
    const anthropic = new Anthropic();

    if (!code) {
      return new Response(JSON.stringify({ error: "No code provided" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    const system = systemPrompt

    const prompt = `
    ## Input Code: 
    \`\`\`
    ${code}
    \`\`\``

    const messages:MessageParam[] = [
      {"role": "user", "content": prompt}
    ]

    const tokens = await anthropic.messages.countTokens({
      model: "claude-haiku-4-5-20251001",
      messages,
      system,
    })
    console.log({tokens});
    
    if (tokens.input_tokens >= 100000) {
      return new Response(JSON.stringify({ refactoredCode: "Input too long. Please reach out to our team for a consultation!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    }

    if (useStream) {
      return handleStreamingRequest(anthropic, messages, system);
    } else {
      return handleTraditionalRequest(anthropic, messages, system);
    }
  } catch (error) {
    console.error("Error in refactor API:", error)
    return new Response(JSON.stringify({ error: "Failed to refactor code - internal server error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}