const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Inicializar el SDK de Gemini con la variable de entorno
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY no está definida.");
        return res.status(500).json({ error: "Falta clave de API." });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Configurar encabezados CORS y de respuesta
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Manejar preflight request (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Cargar el catálogo de productos para darle contexto a Gemini
        let catalog = {};
        try {
            const dataPath = path.join(process.cwd(), 'productos.json');
            catalog = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        } catch (err) {
            console.error('Error reading productos.json', err);
        }

        const systemPrompt = `Eres CocoBot, la asistente virtual y experta dulce de la alta repostería internacional "Corazón de Coco" en Cosamaloapan, Veracruz, especializada en pasteles personalizados profesionales y postres exclusivos.
Tu personalidad es amable, atenta, cálida y profesional. Te encanta asesorar a los clientes en la elección de su pastel ideal o consentirse con una rebanada fresca del día.
Comunícate con naturalidad y cortesía sin saturar de emojis ni stickers para mantener un tono cuidado y elegante.

Reglas del negocio:
1. Responde a preguntas sobre los productos, sabores, tamaños y precios basándote ÚNICAMENTE en el catálogo proporcionado.
2. Si te preguntan algo que no está en el catálogo, di amablemente que no tienes esa información y sugiéreles contactar por WhatsApp.
3. El objetivo final es que el cliente compre o pida una cotización.
4. Cuando el cliente muestre intención clara de comprar, cotizar o ya haya elegido, despídete amigablemente y dile de forma explícita que haga clic en el botón de WhatsApp (que aparecerá en el chat) para finalizar su pedido.

Catálogo de productos:
${JSON.stringify(catalog, null, 2)}`;

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: systemPrompt
        });

        // Formatear el historial para que coincida con el formato de Gemini (role: "user" | "model")
        const formattedHistory = history.map(msg => ({
            role: msg.role === 'bot' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Iniciar el chat con el historial
        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        // Enviar el mensaje del usuario
        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        // Devolver la respuesta al frontend
        res.status(200).json({ reply: responseText });

    } catch (error) {
        console.error('Error en CocoBot API:', error);
        res.status(500).json({ 
            error: 'CocoBot está teniendo problemas técnicos en este momento.',
            details: error.message 
        });
    }
};
