// export const vozes = [
//     { id: 'pt-BR-FranciscaNeural', nome: 'Francisca', idioma: 'Português (Brasil)' },
//     { id: 'pt-BR-AntonioNeural', nome: 'Antônio', idioma: 'Português (Brasil)' },
//     { id: 'en-US-JennyNeural', nome: 'Jenny', idioma: 'Inglês (EUA)' },
//     { id: 'en-US-GuyNeural', nome: 'Guy', idioma: 'Inglês (EUA)' },
//     { id: 'en-GB-SoniaNeural', nome: 'Sonia', idioma: 'Inglês (Reino Unido)' },
//     { id: 'en-GB-RyanNeural', nome: 'Ryan', idioma: 'Inglês (Reino Unido)' },
//     { id: 'es-ES-ElviraNeural', nome: 'Elvira', idioma: 'Espanhol (Espanha)' },
//     { id: 'es-ES-AlvaroNeural', nome: 'Álvaro', idioma: 'Espanhol (Espanha)' },
//     { id: 'fr-FR-DeniseNeural', nome: 'Denise', idioma: 'Francês (França)' },
//     { id: 'it-IT-ElsaNeural', nome: 'Elsa', idioma: 'Italiano (Itália)' },
// ];

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

