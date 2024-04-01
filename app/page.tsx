"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";

// Helper component for rendering a loading spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="loader">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
      </div>
    </div>
  </div>
);

interface ImageDisplayProps {
  image: string | null; // Assuming 'image' is a base64 encoded string or null
  message: string; // Assuming 'message' is always a string
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, message }) => (
  <div className="flex flex-col items-center justify-center h-screen">
    {image && (
      <img src={`data:image/jpeg;base64,${image}`} alt="Generated Content" className="max-w-md max-h-full" />
    )}
    <p className="mt-4 w-full max-w-md text-center text-white bg-black p-4">{message}</p>
  </div>
);

export default function Chat() {
  const { messages, append, isLoading } = useChat();
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const topics = [
    { emoji: "😂", value: "Humor" },
    { emoji: "🎭", value: "Comedy" },
    { emoji: "🤡", value: "Satire" },
    { emoji: "💼", value: "Work" },
    { emoji: "👥", value: "People" },
    { emoji: "🐾", value: "Animals" },
    { emoji: "🍔", value: "Food" },
    { emoji: "📺", value: "Television" },
  ];
  const tones = [
    { emoji: "😊", value: "Happy" },
    { emoji: "😢", value: "Sad" },
    { emoji: "😂", value: "Funny" },
    { emoji: "🎩", value: "Witty" },
    { emoji: "🃏", value: "Sarcastic" },
    { emoji: "😜", value: "Silly" },
    { emoji: "😈", value: "Dark" },
    { emoji: "🤪", value: "Goofy" },
  ];
  const types = [
    { emoji: "🔤", value: "Pun" },
    { emoji: "🚪", value: "Knock-Knock" },
    { emoji: "📜", value: "One-liner" },
    { emoji: "❓", value: "Riddle" },
    { emoji: "🔠", value: "Wordplay" },
    { emoji: "👀", value: "Observational" },
    { emoji: "📖", value: "Story-based" },
  ];

  const [state, setState] = useState({ topic: "", tone: "", type: "" });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setState({ ...state, [name]: value });

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Jokes Generator App</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customise the tone of the joke.
            </p>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Topic</h3>

            <div className="flex flex-wrap justify-center">
              {topics.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    value={value}
                    name="topic"
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Tones</h3>

            <div className="flex flex-wrap justify-center">
              {tones.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="tone"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Types</h3>

            <div className="flex flex-wrap justify-center">
              {types.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="type"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading || !state.topic || !state.tone || !state.type}
            onClick={() =>
              append({
                role: "user",
                content: `Generate a joke about ${state.topic} with ${state.tone} tone and ${state.type} type`,
              })
            }
          >
            Generate Story
          </button>
          <button
            className="bg-blue-500 p-2 text-white rounded shadow-xl"
            disabled={isLoading}
            onClick={async () => {
              setImageIsLoading(true)
              const response = await fetch("api/images", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  message: messages[messages.length - 1].content,
                }),
              });
              const data = await response.json();
              setImage(data);
              setImageIsLoading(false);
            }}
          >
            Generate image
          </button>
          <div
            hidden={
              messages.length === 0 ||
              messages[messages.length - 1]?.content.startsWith("Generate")
            }
            className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
          >
            {messages[messages.length - 1]?.content}
          </div>
        </div>
      </div>
      {imageIsLoading && <LoadingSpinner />}
      {image && !imageIsLoading && <ImageDisplay image={image} message={messages[messages.length - 1]?.content} />}
    </main>
  );
}
