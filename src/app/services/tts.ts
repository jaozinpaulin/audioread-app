export const voices = {
    Portuguese: [
        { id: 'pt-BR-FranciscaNeural', name: 'Francisca (BR)' },
        { id: 'pt-BR-AntonioNeural', name: 'Antônio (BR)' },
        { id: 'pt-BR-ThalitaMultilingualNeural', name: 'Thalita (BR)' },
        { id: 'pt-PT-RaquelNeural', name: 'Raquel (PT)' },
        { id: 'pt-PT-DuarteNeural', name: 'Duarte (PT)' },
    ],

    Spanish: [
        { id: 'es-ES-ElviraNeural', name: 'Elvira (ES)' },
        { id: 'es-ES-AlvaroNeural', name: 'Álvaro (ES)' },
        { id: 'es-ES-XimenaNeural', name: 'Ximena (ES)' },
        { id: 'es-MX-DaliaNeural', name: 'Dalia (MX)' },
        { id: 'es-MX-JorgeNeural', name: 'Jorge (MX)' },
        { id: 'es-AR-ElenaNeural', name: 'Elena (AR)' },
        { id: 'es-AR-TomasNeural', name: 'Tomás (AR)' },
    ],

    English: [
        { id: 'en-US-JennyNeural', name: 'Jenny (US)' },
        { id: 'en-US-GuyNeural', name: 'Guy (US)' },
        { id: 'en-US-AriaNeural', name: 'Aria (US)' },
        { id: 'en-GB-SoniaNeural', name: 'Sonia (UK)' },
        { id: 'en-GB-RyanNeural', name: 'Ryan (UK)' },
    ],
};

export async function sendTTS(text: string, voice: string): Promise<Blob> {
    const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
        throw new Error('Não foi possível gerar o áudio.');
    }

    return response.blob();
}