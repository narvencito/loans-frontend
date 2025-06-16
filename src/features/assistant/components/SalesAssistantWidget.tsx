import { useState } from 'react';
import { useSalesAssistant } from '../hooks/useSalesAssistant';

export default function SalesAssistantWidget() {
  const [input, setInput] = useState('');
  const { messages, loading, sendMessage } = useSalesAssistant();

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-xl rounded-lg p-4 w-full max-w-md z-50">
      <div className="h-64 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'} text-sm`}
          >
            <span className={`inline-block px-3 py-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <p className="text-sm italic text-gray-400">Pensando...</p>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Describe lo que necesitas..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700"
          disabled={loading}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
