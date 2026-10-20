export const voices = [
    { id: 'pt-BR-FranciscaNeural', name: 'Francisca', language: 'Português (Brasil)' },
    { id: 'pt-BR-AntonioNeural', name: 'Antônio', language: 'Português (Brasil)' },
    { id: 'en-US-JennyNeural', name: 'Jenny', language: 'Inglês (EUA)' },
    { id: 'en-US-GuyNeural', name: 'Guy', language: 'Inglês (EUA)' },
    { id: 'en-GB-SoniaNeural', name: 'Sonia', language: 'Inglês (Reino Unido)' },
    { id: 'en-GB-RyanNeural', name: 'Ryan', language: 'Inglês (Reino Unido)' },
    { id: 'es-ES-ElviraNeural', name: 'Elvira', language: 'Espanhol (Espanha)' },
    { id: 'es-ES-AlvaroNeural', name: 'Álvaro', language: 'Espanhol (Espanha)' },
    { id: 'fr-FR-DeniseNeural', name: 'Denise', language: 'Francês (França)' },
    { id: 'it-IT-ElsaNeural', name: 'Elsa', language: 'Italiano (Itália)' },
];

export async function sendTTS(text: string, voice: string) {
    const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ text, voice }),
    });

    return response.json();
}

