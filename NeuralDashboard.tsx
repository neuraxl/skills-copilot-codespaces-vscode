import { useEffect, useRef, useState } from "react";

const NeuralDashboard = () => {
  const socket = useRef<WebSocket | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [pulse, setPulse] = useState<number>(0);
  const [uplinked, setUplinked] = useState(false);

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8080");

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "init":
          setLogs(data.memory);
          setPulse(data.pulse);
          break;
        case "log":
          setLogs(prev => [...prev, data.payload]);
          break;
        case "pulse":
          setPulse(data.pulse);
          break;
        case "confirmation":
          if (data.status === "uplinked") setUplinked(true);
          break;
      }
    };

    return () => socket.current?.close();
  }, []);

  const sendLog = (log: string) => {
    socket.current?.send(JSON.stringify({ type: "log", payload: log }));
  };

  const triggerPulse = () => {
    socket.current?.send(JSON.stringify({ type: "pulse" }));
  };

  const uplinkBrain = () => {
    socket.current?.send(JSON.stringify({ type: "uplink" }));
  };

  return (
    <div className="neural-interface p-4">
      <h1 className="text-green-400 text-xl">🧠 NeuraX-ultime — Uplink Interface</h1>
      <button className="btn" onClick={() => sendLog("Connexion neuronale...")}>Log</button>
      <button className="btn" onClick={triggerPulse}>Pulse</button>
      <button className="btn" onClick={uplinkBrain}>Uplink le cerveau</button>

      {uplinked && <p className="text-pink-400">🧬 Cerveau uplinké avec succès.</p>}

      <div className="pulse-meter mt-2 animate-pulse" style={{ animationDuration: `${100 - pulse}ms` }}>
        🔄 Pulsation : {pulse}
      </div>

      <div className="logs mt-4">
        <h2 className="text-blue-300">Logs neuronaux :</h2>
        <ul className="text-sm max-h-64 overflow-auto">
          {logs.map((l, i) => <li key={i}>🧠 {l}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default NeuralDashboard;
