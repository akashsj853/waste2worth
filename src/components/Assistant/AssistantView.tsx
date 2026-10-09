import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  RefreshCw,
  User,
  ShieldCheck,
} from 'lucide-react';
import { SustainabilityMetrics } from '../../engine/impactCalculator';

interface AssistantViewProps {
  metrics: SustainabilityMetrics;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AssistantView: React.FC<AssistantViewProps> = ({ metrics }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I am the **Waste2Worth AI Sustainability Advisor**. I can help you with material segregation guidelines, local recycling rules, compost troubleshooting, and circular resource recovery.\n\nCurrent Campus Context:\n• **${metrics.totalScans}** waste scans recorded\n• **${metrics.totalDivertedWeightKg} kg** diverted from landfill (${metrics.diversionRatePercent}% diversion rate)\n• **${metrics.estimatedCompostYieldKg} kg** estimated compost yield\n\nHow can I assist your sustainability efforts today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    'Why does my compost smell like ammonia and how do I fix it?',
    'Can greasy takeaway pizza boxes be put into dry paper recycling?',
    'What are the fire safety precautions for lithium batteries and e-waste?',
    'How do I balance the C:N ratio for dining hall food scraps?',
    'What happens to rigid plastics #1 PET and #2 HDPE during reprocessing?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const campusContext = `Campus Waste Audit: Total scans=${metrics.totalScans}, Diverted=${metrics.totalDivertedWeightKg}kg (${metrics.diversionRatePercent}% diversion), Compost=${metrics.estimatedCompostYieldKg}kg. Active streams: Organic, Plastic, Paper, Metal, Glass, Textile, E-waste.`;

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: campusContext,
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'I could not generate an answer at this time.';

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('Assistant error, using fallback:', err);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: 'Always remember: Clean, ungreased paper can be recycled. Greasy unbleached cardboard should be torn and added to compost piles as carbonaceous browns. Lithium batteries must never enter standard bins to prevent fires.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 rounded-3xl p-6 sm:p-8 border border-emerald-800/40 text-stone-100 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <Bot className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            AI Sustainability Intelligence
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          AI Sustainability & Segregation Advisor
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
          Ask questions about material segregation, contamination thresholds, agronomic compost chemistry, and circular resource recovery. Powered by multimodal intelligence and grounded in verified EPA WARM and local collection rules.
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Frequently Asked Questions (Click to Ask):
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 transition-colors text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages scroll area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-stone-100 rounded-tr-none'
                    : 'bg-stone-50 border border-stone-200/80 text-stone-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                <div
                  className={`flex items-center justify-between text-[10px] pt-1 border-t ${
                    msg.sender === 'user'
                      ? 'border-stone-800 text-stone-400'
                      : 'border-stone-200/60 text-stone-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-stone-700 flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Consulting materials database & reasoning...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 bg-stone-50 border-t border-stone-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about segregation, plastic codes, compost C:N ratios, or local drop-offs..."
              disabled={isLoading}
              className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-stone-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Advisor</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
