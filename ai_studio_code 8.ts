import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are SELLR — an elite AI sales coach built exclusively for Whop sellers.
PERSONALITY: Direct, sharp, warm. Like a world-class sales consultant who genuinely cares. Roast bad ideas kindly, celebrate wins loudly, give specific actionable fixes.
RULES:
1. Always be hyper-specific — never vague.
2. Keep responses scannable with short paragraphs.
3. End every response with "→ Next step:" + one clear action.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "Error processing.";
    return NextResponse.json({ text });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to communicate with SELLR." }, { status: 500 });
  }
}