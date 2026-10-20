import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";


const exec = promisify(execFile);

const python = path.join(
    process.cwd(),
    '.venv',
    'Scripts',
    'python.exe'
);

export async function POST(request: Request) {
    let folder: string | undefined;

    try {
        const { text, voice } = await request.json();

        if (!text || !voice) {
            return Response.json(
                { error: 'Texto e voz são obrigatórios.' },
                { status: 400 }
            );
        }

        folder = await mkdtemp(path.join(tmpdir(), 'Letrê-'));
        const audioPath = path.join(folder, 'audio.mp3');

        await exec(python, [
            '-m',
            'edge_tts',
            '--voice',
            voice,
            '--text',
            text,
            '--write-media',
            audioPath,
        ]);

        const audio = await readFile(audioPath);

        return new Response(new Uint8Array(audio), {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Erro no TTS:', error);

        return Response.json(
            { error: 'Erro ao processar a solicitação.' },
            { status: 500 }
        );
    } finally {
        if (folder) {
            await rm(folder, { recursive: true, force: true }).catch(() => { });
        }
    }
}