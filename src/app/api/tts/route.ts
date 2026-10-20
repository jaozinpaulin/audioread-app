export async function POST(request: Request) {
    const { text, voice } = await request.json();

    console.log("Texto:", text);
    console.log("Voz", voice);

    return Response.json({
        message: "Dados recebidos com sucesso!",
    });
}