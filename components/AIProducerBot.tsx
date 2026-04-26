
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, X, Minimize2, Maximize2, ChevronRight, Cpu } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

export const AIProducerBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
        id: '1',
        sender: 'bot',
        text: "VELOCITY_PILOT v1.2 ONLINE.\nInitialize query protocol...",
        timestamp: Date.now()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isMinimized]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Processing
    setTimeout(() => {
        const botMsg = getBotResponse(input);
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getBotResponse = (query: string): Message => {
      const lower = query.toLowerCase();
      let response = "Syntax Error: Input parameters unclear. Please refine prompt.";

      if (lower.includes('help')) {
          response = "List of Directives:\n> /analyze_trends : Scan active viral vectors\n> /generate_lyrics : Initiate vocal synthesis text\n> /mixing_tips : Optimization protocols";
      } else if (lower.includes('analyze') || lower.includes('trend')) {
          response = "SCANNING DATA STREAMS...\n[||||||||||] 100%\n\nTarget Detected: 'Breakbeat Kota'\nKey: A Minor\nBPM: 145\nViral Coefficient: 98.2%";
      } else if (lower.includes('lyrics') || lower.includes('write')) {
          response = "Lyric Module Active. Suggested hook:\n'Malam ini kita goyang'\n'Sampai pagi jangan pulang'";
      } else if (lower.includes('master') || lower.includes('mix')) {
          response = "Optimization Suggestion: Boost 60Hz by +2dB for 'Jedag Jedug' kick impact. Apply sidechain compression at ratio 4:1.";
      } else if (lower.includes('hello') || lower.includes('hi')) {
          response = "Greetings, Operator. Ready to synthesize.";
      }

      return { id: Date.now().toString(), sender: 'bot', text: response, timestamp: Date.now() };
  };

  // Quick Actions
  const runCommand = (cmd: string) => {
      setInput(cmd);
      // Optional: could auto-submit here, but letting user confirm is often better UX or just auto-focus
  };

  if (!isOpen) {
      return (
          <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-black/90 backdrop-blur-md border border-green-500/30 shadow-[0_0_20px_rgba(74,222,128,0.15)] rounded-2xl flex items-center justify-center group hover:scale-105 transition-all duration-300 hover:border-green-500 hover:shadow-[0_0_30px_rgba(74,222,128,0.3)]"
          >
              {/* Technical Rotating Ring */}
              <div className="absolute inset-0 rounded-2xl border border-green-500/10 group-hover:rotate-90 transition-transform duration-700"></div>
              
              {/* Text instead of Icon */}
              <span className="font-mono text-[10px] font-bold text-green-500 group-hover:text-green-400 tracking-wider">AI</span>
              
              {/* Online Indicator */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-black rounded-full flex items-center justify-center border border-green-900">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              </div>
          </button>
      );
  }

  return (
      <div className={`fixed z-50 bg-black/95 backdrop-blur-xl border border-green-900/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-300 flex flex-col overflow-hidden ring-1 ring-white/5
        ${isMinimized ? 'bottom-6 right-6 w-72 h-12 rounded-lg' : 'bottom-6 right-6 w-80 md:w-96 h-[500px] rounded-xl'}
      `}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-950/30 to-transparent border-b border-green-900/30 cursor-pointer select-none" onClick={() => !isMinimized && setIsMinimized(!isMinimized)}>
              <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-900/20 rounded-md flex items-center justify-center border border-green-500/20">
                    <Cpu className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-green-400 uppercase tracking-widest block leading-none mb-0.5">Velocity_Pilot</span>
                    <span className="text-[8px] font-mono text-green-600/70 uppercase tracking-wider block leading-none">AI Producer Assistant</span>
                  </div>
              </div>
              <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="text-green-700 hover:text-green-400 transition-colors">
                      {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-green-700 hover:text-green-400 transition-colors">
                      <X className="w-3 h-3" />
                  </button>
              </div>
          </div>

          {!isMinimized && (
              <>
                  {/* Chat Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs scrollbar-thin scrollbar-thumb-green-900/50 scrollbar-track-transparent">
                      {messages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] p-3 rounded-sm border backdrop-blur-sm ${
                                  msg.sender === 'user' 
                                  ? 'bg-neutral-900/80 border-neutral-800 text-neutral-300 rounded-tr-none' 
                                  : 'bg-green-950/10 border-green-900/30 text-green-400 rounded-tl-none shadow-[0_0_15px_rgba(0,255,0,0.05)]'
                              }`}>
                                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                                  <div className="mt-1.5 text-[8px] opacity-40 uppercase tracking-wider flex justify-end">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                              </div>
                          </div>
                      ))}
                      {isTyping && (
                          <div className="flex justify-start animate-pulse">
                              <div className="bg-green-950/10 border border-green-900/30 p-3 rounded-sm flex gap-1 items-center">
                                  <span className="text-[9px] text-green-600 uppercase tracking-wider mr-2">Computing</span>
                                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                  <div className="w-1 h-1 bg-green-500 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-1 h-1 bg-green-500 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                          </div>
                      )}
                      <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Actions */}
                  <div className="px-4 py-2 border-t border-green-900/20 flex gap-2 overflow-x-auto no-scrollbar bg-green-950/5">
                      {['/analyze_trends', '/generate_lyrics', '/mixing_tips'].map(cmd => (
                          <button 
                            key={cmd}
                            onClick={() => runCommand(cmd)}
                            className="whitespace-nowrap px-2.5 py-1.5 bg-black border border-green-900/40 text-[9px] font-mono text-green-600 hover:text-green-400 hover:border-green-500/70 transition-all uppercase rounded-sm"
                          >
                              {cmd}
                          </button>
                      ))}
                  </div>

                  {/* Input Area */}
                  <form onSubmit={handleSend} className="p-3 bg-black/50 border-t border-green-900/30 flex gap-2">
                      <div className="flex-1 relative group">
                          <ChevronRight className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-green-700 group-focus-within:text-green-500 transition-colors" />
                          <input 
                              type="text" 
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              className="w-full bg-neutral-900/50 border border-neutral-800 text-green-400 text-xs font-mono py-2.5 pl-8 pr-3 focus:outline-none focus:border-green-500/50 focus:bg-black transition-all placeholder-green-900 rounded-sm"
                              placeholder="Input command..."
                          />
                      </div>
                      <button type="submit" className="px-3 bg-green-900/10 border border-green-900/30 text-green-600 hover:bg-green-900/30 hover:text-green-400 transition-all rounded-sm">
                          <Send className="w-3.5 h-3.5" />
                      </button>
                  </form>
              </>
          )}
      </div>
  );
};
