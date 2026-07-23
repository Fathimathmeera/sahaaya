import OpenAI from "openai";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const { situation, routeData = "" } = await request.json();
    if (typeof situation !== "string" || !situation.trim()) return NextResponse.json({ error: "Describe what is happening so Sahaya can prepare guidance." }, { status: 400 });
    const fallback = { guidance: "Move to the nearest safe, step-free exit if it is safe to do so. Ask a nearby person for assistance and call local emergency services.", message: `Emergency: ${situation.slice(0, 240)}. I need assistance. Please contact me and use the location link in this SOS message.` };
    if (!process.env.OPENAI_API_KEY) return NextResponse.json(fallback);
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({ model: process.env.OPENAI_TEXT_MODEL || "gpt-5-mini", instructions: "Give calm, concise emergency guidance for a wheelchair user. Use only supplied route facts; do not claim an exit is safe or available. Include a brief contact message. Tell the person to call local emergency services for immediate danger. Return JSON.", input: JSON.stringify({ situation: situation.slice(0, 800), routeData: String(routeData).slice(0, 800) }), text: { format: { type: "json_schema", name: "emergency_guidance", strict: true, schema: { type: "object", additionalProperties: false, properties: { guidance: { type: "string", maxLength: 700 }, message: { type: "string", maxLength: 360 } }, required: ["guidance", "message"] } } } });
    return NextResponse.json(JSON.parse(response.output_text));
  } catch (error) { console.error("Emergency guidance failed", error); return NextResponse.json({ error: "Emergency guidance is unavailable. Call local emergency services if you are in danger." }, { status: 500 }); }
}