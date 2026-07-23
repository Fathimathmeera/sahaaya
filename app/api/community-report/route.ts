import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const categories = ["Ramp", "Elevator", "Accessible Toilet", "Parking"] as const;

export async function POST(request: Request) {
  try {
    const { placeName, comment, rating, status } = await request.json();
    if (typeof placeName !== "string" || typeof comment !== "string" || !Number.isInteger(rating)) return NextResponse.json({ error: "Enter a place, comment, and rating." }, { status: 400 });
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "AI report assistance is unavailable right now. Your original report can still be saved." }, { status: 503 });
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_TEXT_MODEL || "gpt-5-mini",
      instructions: "Rewrite a wheelchair-accessibility community report. Preserve facts; do not add claims. Choose exactly one category from the supplied list. Return concise, plain-language JSON.",
      input: `Place: ${placeName.slice(0, 120)}\nStatus: ${status}\nRating: ${rating}/5\nReport: ${comment.slice(0, 1200)}`,
      text: { format: { type: "json_schema", name: "community_report", strict: true, schema: { type: "object", additionalProperties: false, properties: { comment: { type: "string", maxLength: 900 }, summary: { type: "string", maxLength: 180 }, accessibilityType: { type: "string", enum: [...categories] } }, required: ["comment", "summary", "accessibilityType"] } } }
    });
    return NextResponse.json(JSON.parse(response.output_text));
  } catch (error) {
    console.error("Community report assistant failed", error);
    return NextResponse.json({ error: "We couldn't prepare the report. Please try again or save your original wording." }, { status: 500 });
  }
}