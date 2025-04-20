const WebSocket = require('ws');
const deeplx = require('deeplx');

const wss = new WebSocket.Server({ port: 3060 });

wss.on('connection', function connection(ws) {
    console.log('BetterDiscord plugin is in touch.');

    ws.on('message', async function incoming(message, isBinary) {
        try {
            const messageData = JSON.parse(message);
            const sourceText = messageData.text;
            const targetLang = messageData.targetLang;
            const messageObject = messageData.message;
            
            const translatedMessage = await deeplx.translate(sourceText, targetLang);
            
            ws.send(JSON.stringify({ 
                translated: translatedMessage,
                original: sourceText,
                message: messageObject,
                targetLang: targetLang
            }));
        } catch (error) {
            console.error('Translation error:', error);
            ws.send(JSON.stringify({ error: 'Translation failed' }));
        }
    });

    ws.on('close', function () {
        console.log('BetterDiscord plugin has disconnected');
    });
});
