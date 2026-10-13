document.addEventListener("DOMContentLoaded", () => {
    // 1. Inyectar HTML del widget
    const widgetHTML = `
        <div id="cocobot-widget">
            <div id="cocobot-window">
                <div id="cocobot-header">
                    <div class="title"><i class="fa fa-heart mr-1" style="color: #2E4057;"></i> CocoBot Asistente</div>
                    <button id="cocobot-close">&times;</button>
                </div>
                <div id="cocobot-body">
                    <div class="cocobot-msg bot">¡Hola! Soy CocoBot, tu asistente en Corazón de Coco. ¿En qué te puedo orientar hoy? Puedes preguntarme sobre recomendaciones de pasteles, porciones o sabores.</div>
                    <div class="cocobot-typing" id="cocobot-typing">
                        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                    </div>
                </div>
                <div id="cocobot-input-area">
                    <input type="text" id="cocobot-input" placeholder="Escribe tu consulta..." autocomplete="off">
                    <button id="cocobot-send"><i class="fa fa-paper-plane"></i></button>
                </div>
            </div>
            <div id="cocobot-toggler" aria-label="Abrir Asistente">
                <i class="fa fa-comments" style="color: #ffffff; font-size: 26px;"></i>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", widgetHTML);

    // 2. Elementos del DOM
    const toggler = document.getElementById("cocobot-toggler");
    const chatWindow = document.getElementById("cocobot-window");
    const closeBtn = document.getElementById("cocobot-close");
    const inputField = document.getElementById("cocobot-input");
    const sendBtn = document.getElementById("cocobot-send");
    const chatBody = document.getElementById("cocobot-body");
    const typingIndicator = document.getElementById("cocobot-typing");

    // Historial de la conversación
    let chatHistory = [];
    const whatsappNumber = "5212881409816"; // Cambiar por el número real del cliente

    // 3. Event Listeners
    toggler.addEventListener("click", () => {
        chatWindow.classList.toggle("open");
        if (chatWindow.classList.contains("open")) {
            inputField.focus();
        }
    });

    closeBtn.addEventListener("click", () => {
        chatWindow.classList.remove("open");
    });

    sendBtn.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    // 4. Lógica de mensajes
    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        // Añadir mensaje del usuario
        appendMessage(text, 'user');
        inputField.value = "";
        
        // Mostrar "escribiendo..."
        chatBody.appendChild(typingIndicator); // Mover al final
        typingIndicator.style.display = "block";
        scrollToBottom();

        try {
            // Llamada a la API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: text, 
                    history: chatHistory 
                })
            });

            const data = await response.json();
            
            typingIndicator.style.display = "none";

            if (response.ok) {
                // Guardar en el historial local
                chatHistory.push({ role: 'user', content: text });
                chatHistory.push({ role: 'bot', content: data.reply });
                
                appendMessage(data.reply, 'bot');
            } else {
                appendMessage("Lo siento, estoy teniendo problemas técnicos. Por favor, contáctanos directo a WhatsApp.", 'bot');
            }

        } catch (error) {
            console.error("Error llamando a CocoBot API:", error);
            typingIndicator.style.display = "none";
            appendMessage("Ups, hubo un error de conexión. Intenta de nuevo.", 'bot');
        }
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `cocobot-msg ${sender}`;
        
        // Formatear texto (convertir URLs y detectar intención de WhatsApp)
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold simple
        
        if (sender === 'bot') {
            // Si el texto parece invitar a cotizar, agregar botón de WA
            const waKeywords = ["whatsapp", "cotizar", "comprar", "pedido"];
            const lowerText = text.toLowerCase();
            
            msgDiv.innerHTML = formattedText;
            
            if (waKeywords.some(kw => lowerText.includes(kw))) {
                const encodedMsg = encodeURIComponent("Hola Corazón de Coco, vengo del chat y me interesa hacer un pedido/cotización.");
                const waLink = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
                msgDiv.innerHTML += `<br><a href="${waLink}" target="_blank" class="cocobot-wa-btn"><i class="fa fa-whatsapp"></i> Hablar por WhatsApp</a>`;
            }
        } else {
            msgDiv.textContent = text;
        }

        chatBody.insertBefore(msgDiv, typingIndicator);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});
