import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const model = 'gemini-3.8-flash-lite-tts';

export async function POST(request: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Chave da API não configurada.' },
                { status: 500 }
            );
        }

        const { text, voice } = await request.json();

        if (typeof text !== 'string' || !text.trim()) {
            return NextResponse.json(
                { error: 'O texto é obrigatório.' },
                { status: 400 }
            );
        }

        const client = new GoogleGenAI({ apiKey });

        const response = await client.interactions.create({
            model,
            input: [{
                type: 'user_input',
                content: [{
                    type: 'text',
                    text: text.trim(),
                    annotations: [{
                        type: 'speech_metadata',
                        style: 'Natural, clear audiobook narration with a calm pace and natural pauses. Speak in the language of the supplied text.',
                    }],
                }],
            }],
            response_format: {
                type: 'audio',
            },
            generation_config: {
                speech_config: [{
                    voice: 'Kore',
                }],
            },
        });

        const audio = response.output_audio;

        if (!audio?.data) {
            throw new Error('A API não retornou dados de áudio.');
        }

        const audioBuffer = Buffer.from(audio.data, 'base64');

        return new Response(audioBuffer, {
            headers: {
                'Content-Type': 'audio/wav',
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Erro no Gemini TTS:', error);

        return NextResponse.json(
            { error: 'Não foi possível gerar o áudio.' },
            { status: 500 }
        );
    }
}