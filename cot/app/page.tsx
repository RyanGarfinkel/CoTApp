'use client';

import { useState } from 'react';

const Home = () => {

  const [prompt, setPrompt] = useState('');
  const [standardResponse, setStandardResponse] = useState('');
  const [cotResponse, setCotResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {

    if (!prompt)
      return;
    
    setLoading(true);
    setStandardResponse('');
    setCotResponse('');

    try
    {
      const response = await fetch('/api/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: prompt
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader)
        return;
    
      while (true)
      {
        const { done, value } = await reader.read();
        if (done)
          break;

        const text = decoder.decode(value);
        const lines = text.split('\n').filter(line => line.trim());

        for (const line of lines)
        {
          const data = JSON.parse(line);
          setStandardResponse(data.standardResponse);
          setCotResponse(data.cotResponse);
        }
      }
    } catch (error)
    {
      console.error('Error:', error);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="min-h-[100px] w-full rounded-lg border border-zinc-200 p-4 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
        />
        
        <button
          onClick={handleClick}
          disabled={loading || !prompt}
          className="rounded-lg bg-black px-6 py-3 text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          { loading ? 'Loading...' : 'Generate Responses' }
        </button>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-4 text-xl font-semibold">
              Standard Response
            </h2>
            <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              { standardResponse || 'Response will appear here...' }
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-4 text-xl font-semibold">
              Chain of Thought Response
            </h2>
            <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              { cotResponse || 'Response will appear here...' }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
