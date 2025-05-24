// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let memory = [];
let pulse = 0;

wss.on('connection', function connection(ws) {
  console.log('Neurone connecté.');

  // Envoi initial de mémoire et pulsation
  ws.send(JSON.stringify({ type: 'init', memory, pulse }));

  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    
    if (data.type === 'log') {
      memory.push(data.payload);
      // Broadcast à tous
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'log', payload: data.payload }));
        }
      });
    }

    if (data.type === 'pulse') {
      pulse = (pulse + 1) % 100;
      ws.send(JSON.stringify({ type: 'pulse', pulse }));
    }

    if (data.type === 'uplink') {
      ws.send(JSON.stringify({ type: 'confirmation', status: 'uplinked' }));
    }
  });

  ws.on('close', () => console.log("Déconnexion neuronale."));
});
