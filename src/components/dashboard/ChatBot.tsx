import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare, Clock } from 'lucide-react';

type Message = {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  confidence?: number;
};

type Props = {
  compact?: boolean;
};

export default function ChatBot({ compact = false }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: "MiaAI is coming soon! 🚀\n\nOur Marketing Intelligence Assistant is currently in final testing. She'll be ready to help optimize your campaigns in:\n\n⏰ 90 days",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center space-x-3">
        <div className="bg-white/10 p-2 rounded-lg">
          <MessageSquare className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-white font-semibold text-lg">MiaAI Assistant</h2>
          <p className="text-white/80 text-sm">Marketing Intelligence Assistant</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className={`flex-1 overflow-y-auto ${compact ? 'h-[400px]' : 'h-[calc(100vh-16rem)]'}`}>
        <div className="p-6 space-y-6">
          {/* AI Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150"
                alt="MiaAI"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full border-2 border-white">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Messages */}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                msg.type === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                  : 'bg-gray-50 border border-gray-100'
              }`}>
                <p className="whitespace-pre-line leading-relaxed text-[15px]">{msg.content}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-xs ${
                    msg.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              disabled
              placeholder="MiaAI is coming soon..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-500 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button
              disabled
              className="px-4 py-3 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed flex items-center space-x-2 hover:bg-gray-100/80 transition-colors"
            >
              <Clock className="h-5 w-5" />
              <span className="font-medium">Coming Soon</span>
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-3 text-center">
            MiaAI is in final testing and will be available in 90 days
          </p>
        </div>
      </div>
    </div>
  );
}
