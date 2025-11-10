'use client';

import { useState } from 'react';

const Home = () => {
  const [standardResponse, setStandardResponse] = useState('');
  const [cotResponse, setCotResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
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
          query: 'A farmer has 15 sheep and all but 8 die. How many are left?'
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if(!reader)
        return;

      while(true)
      {
        const { done, value } = await reader.read();
        if(done)
          break;

        const text = decoder.decode(value);
        const lines = text.split('\n').filter(line => line.trim());

        for (const line of lines)
        {
          try
          {
            const data = JSON.parse(line);
            setStandardResponse(data.standardResponse);
            setCotResponse(data.cotResponse);
          } catch(e)
          {
            console.error('Error:', e);
          }
        }
      }
    } catch(error)
    {
      console.error('Error:', error);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <button
          onClick={handleClick}
          disabled={loading}
        >
          { loading ? 'Loading...' : 'Get Response' }
        </button>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2>Standard Response</h2>
            <p>
              { standardResponse || 'Loading...' }
            </p>
          </div>

          <div>
            <h2>CoT Response</h2>
            <p>
              { cotResponse || 'Loading...' }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
