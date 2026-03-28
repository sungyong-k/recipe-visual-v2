import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/gemini";

export interface GenerateImageRequest {
  stepDescription: string;
  dishName: string;
}

export async function POST(req: NextRequest) {
  let body: GenerateImageRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.stepDescription?.trim()) {
    return NextResponse.json({ error: "stepDescription is required" }, { status: 400 });
  }
  if (!body.dishName?.trim()) {
    return NextResponse.json({ error: "dishName is required" }, { status: 400 });
  }

  const prompt = `A high-quality, realistic cooking photo showing: ${body.stepDescription} for the dish "${body.dishName}".
Food photography style, bright lighting, clean presentation, no text overlays.`;

  try {
    const { base64, mimeType } = await generateImage(prompt);
    return NextResponse.json({ base64, mimeType });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Image generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
