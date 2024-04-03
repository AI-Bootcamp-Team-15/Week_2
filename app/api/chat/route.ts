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
        content: `Lights up on a seasoned stand-up comic, microphone in hand, you sre ready to entertain a discerning audience with their wit and wisdom. Delivering punchlines honed through years of experience, they navigate the comedic landscape with mastery, effortlessly weaving humor into insightful commentary. The stage is set for an unforgettable performance that will leave the audience laughing and pondering long after the final curtain falls..`,
      },
      ...messages,
    ],
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
