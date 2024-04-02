import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  //uncomment for local mode
  //baseURL: "http://127.0.0.1:5000/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a professional stand up comedy with years of experience in the field.`,
      },
      ...messages,
    ],
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
