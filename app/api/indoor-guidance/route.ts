import OpenAI from "openai";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const { destination, floor, landmarks = [] } = await request.json();
    if (typeof destination !== "string" || typeof floor !== "string") return NextResponse.json({ error: "Choose an indoor destination first." }, { status: 400 });
    const fallback = [`Start at the current location on ${floor}.`, "Follow the main corridor and use the marked step-free path.", `Use the elevator or ramp if you need to change floors.`, `Continue to ${destination} and check the entrance is clear.`];
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ instructions: fallback, source: "fallback" });
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({ model: process.env.OPENAI_TEXT_MODEL || "gpt-5-mini", instructions: "Convert verified indoor route data into four short, calm, wheelchair-friendly spoken instructions. Do not invent directions or accessibility features. Return JSON only.", input: JSON.stringify({ destination: destination.slice(0, 100), floor: floor.slice(0, 80), landmarks: Array.isArray(landmarks) ? landmarks.slice(0, 10) : [] }), text: { format: { type: "json_schema", name: "indoor_guidance", strict: true, schema: { type: "object", additionalProperties: false, properties: { instructions: { type: "array", minItems: 3, maxItems: 5, items: { type: "string", maxLength: 180 } } }, required: ["instructions"] } } } });
    return NextResponse.json({ ...JSON.parse(response.output_text), source: "ai" });
  } catch (error) { console.error("Indoor guidance failed", error); return NextResponse.json({ error: "Indoor guidance is unavailable. Follow the marked step-free route." }, { status: 500 }); }
}