import { getCoTPrompt, getStandardPrompt } from '@/app/utils/promptGenerator';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {

    const { query } = await request.json();

    if(!query)
        return NextResponse.json({ error: 'No query provided' }, { status: 400 });

    try
    {
        const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const standardPrompt = getStandardPrompt(query);
        const cotPrompt = getCoTPrompt(query);

        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {

                let standardResponse = '';
                let cotResponse = '';

                const sendUpdate = () => {
                    controller.enqueue(encoder.encode(JSON.stringify({ 
                        standardResponse, 
                        cotResponse,
                        reasoning: cotResponse
                    }) + '\n'));
                };

                const [standardResult, cotResult] = await Promise.all([
                    model.generateContentStream(standardPrompt),
                    model.generateContentStream(cotPrompt)
                ]);

                const processStandard = (async () => {
                    for await (const chunk of standardResult.stream) {
                        standardResponse += chunk.text();
                        sendUpdate();
                    }
                })();

                const processCot = (async () => {
                    for await (const chunk of cotResult.stream) {
                        cotResponse += chunk.text();
                        sendUpdate();
                    }
                })();

                await Promise.all([processStandard, processCot]);

                controller.close();
            }
        })

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            }
        });
    } catch(error)
    {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};