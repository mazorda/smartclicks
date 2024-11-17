import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare } from 'lucide-react';

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
      content: "Hi! I'm MIA (Marketing Intelligence Assistant) 🤖\n\nI have direct access to your Google Ads data and can provide real-time analysis and recommendations. How can I help you optimize your campaigns today?\n\nTry asking:",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const exampleQuestions = [
    "Why did our CPA increase in March?",
    "Which campaigns have the highest wasted spend?"
  ];

  const sampleResponses: Record<string, string> = {
    "Why did our CPA increase in March?": "Based on your account data, the CPA increase in March (+15%) was primarily due to:\n\n1. Seasonal competition (industry-wide trend)\n2. Lower quality scores on key terms\n3. Reduced conversion rates on mobile devices\n\nRecommended actions:\n• Implement mobile-specific bid adjustments\n• Update ad copy to improve quality scores\n• Focus budget on top-performing hours",
    "Which campaigns have the highest wasted spend?": "I've analyzed your campaigns and identified potential wasted spend:\n\n1. Display Campaign 'Brand Awareness'\n   • 45% of spend on non-converting placements\n   • Potential savings: $2,450/month\n\n2. Search Campaign 'Generic Terms'\n   • High CPC keywords with no conversions\n   • Potential savings: $1,850/month\n\nWould you like me to prepare a detailed optimization plan?"
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user' as const,
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = sampleResponses[input] || "I'm analyzing your question. Based on your account data, I'll provide a detailed response with actionable insights.";

    const botMessage = {
      type: 'bot' as const,
      content: response,
      timestamp: new Date(),
      confidence: 95
    };

    setMessages(prev => [...prev, botMessage]);
    setLoading(false);
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
    handleSend();
  };

  return (
    <div className={`flex flex-col ${compact ? 'h-[400px]' : 'h-[calc(100vh-12rem)]'}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-4 ${
              msg.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100'
            }`}>
              <p className="whitespace-pre-line">{msg.content}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-xs ${
                  msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {msg.timestamp.toLocaleTimeString()}
                </span>
                {msg.confidence && (
                  <span className="text-xs text-gray-500">
                    {msg.confidence}% confidence
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuestionClick(q)}
                className="text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-sm"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your PPC performance..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}