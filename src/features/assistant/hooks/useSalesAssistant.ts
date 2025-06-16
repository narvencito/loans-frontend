import { useState } from 'react';
import { api } from '@/shared/utils/api';

export function useSalesAssistant() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const sendMessage = async (content: string) => {
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content }]);

    try {
      const res = await api.post('/assistant/sales', { message: content });
      const reply = res.data?.reply || 'No tengo una respuesta en este momento.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ocurrió un error.' }]);
    }

    setLoading(false);
  };

  return { messages, loading, sendMessage };
}
