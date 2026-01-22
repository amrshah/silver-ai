import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Message, Sender, AppDefinition, AppSettings } from '../types';
import IconRenderer from './IconRenderer';
import { streamMessage, generateImage } from '../services/aiGatewayService';

interface ChatInterfaceProps {
  activeApp: AppDefinition;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  settings: AppSettings;
  threadId: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeApp, messages, setMessages, settings, threadId }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isGeneratingImage) return;

    const userText = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text: userText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const responseMsgId = (Date.now() + 1).toString();

      // Initial empty response message
      setMessages(prev => [
        ...prev,
        {
          id: responseMsgId,
          sender: Sender.MODEL,
          text: '',
          isStreaming: true,
          timestamp: Date.now(),
        }
      ]);

      let fullResponse = '';
      const stream = streamMessage(userText, activeApp.systemInstruction, settings.maxTokens, threadId || undefined, activeApp.id);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === responseMsgId
              ? { ...msg, text: fullResponse }
              : msg
          )
        );
      }

      // Finish streaming
      setMessages(prev =>
        prev.map(msg =>
          msg.id === responseMsgId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!input.trim() || isLoading || isGeneratingImage) return;

    const prompt = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text: `Generate an image for: "${prompt}"`,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsGeneratingImage(true);

    try {
      const responseMsgId = (Date.now() + 1).toString();

      // Adding a temporary "Model is thinking/generating" message
      setMessages(prev => [
        ...prev,
        {
          id: responseMsgId,
          sender: Sender.MODEL,
          text: 'Generating your masterpiece...',
          isStreaming: true,
          timestamp: Date.now(),
        }
      ]);

      const imageUrl = await generateImage(prompt);

      setMessages(prev =>
        prev.map(msg =>
          msg.id === responseMsgId
            ? { ...msg, text: 'Here is what I created for you:', imageUrl, isStreaming: false }
            : msg
        )
      );

    } catch (error: any) {
      console.error("Image generation error:", error);
      const responseMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: responseMsgId,
        sender: Sender.MODEL,
        text: `Failed to generate image: ${error.message}`,
        timestamp: Date.now(),
      }]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d1117] relative">
      {/* Active Applet Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gray-950/80 backdrop-blur-md border-b border-gray-900 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-2.5 px-4 py-1.5 bg-gray-900 rounded-2xl border border-gray-800 pointer-events-auto shadow-lg">
          <div className="w-5 h-5 flex items-center justify-center text-blue-400">
            <IconRenderer name={activeApp.icon || 'Sparkles'} size={16} />
          </div>
          <span className="text-sm font-bold text-gray-200 tracking-tight">{activeApp.name}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-24 md:px-0 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-10">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
              <div className="w-20 h-20 rounded-3xl bg-gray-900 flex items-center justify-center text-blue-400 mb-8 shadow-2xl border border-gray-800 animate-in fade-in zoom-in duration-500">
                <IconRenderer name={activeApp.icon || 'Sparkles'} size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">{activeApp.name}</h2>
              <p className="text-gray-400 max-w-md text-lg font-medium leading-relaxed">{activeApp.description}</p>

              <div className="mt-10 grid grid-cols-2 gap-3 w-full max-w-sm">
                <div className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800 text-xs text-gray-500 font-medium">
                  Explain complex topics
                </div>
                <div className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800 text-xs text-gray-500 font-medium">
                  Brainstorm creative ideas
                </div>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              {msg.sender === Sender.MODEL && (
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-600/20 flex-shrink-0 flex items-center justify-center text-blue-400 shadow-sm mt-1">
                  <IconRenderer name={activeApp.icon || 'Sparkles'} size={20} />
                </div>
              )}

              <div
                className={`
                  max-w-[85%] md:max-w-[80%] px-6 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm font-medium
                  ${msg.sender === Sender.USER
                    ? 'bg-blue-600 text-white rounded-br-none shadow-blue-600/10'
                    : 'bg-gray-900 text-gray-200 rounded-bl-none border border-gray-800 shadow-black/20'
                  }
                `}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                  {msg.imageUrl && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-800 bg-black/20">
                      <img src={msg.imageUrl} alt="Generated" className="w-full h-auto object-cover max-h-96" />
                    </div>
                  )}
                  {msg.isStreaming && (
                    <span className="inline-flex ml-1 items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-75" />
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-150" />
                    </span>
                  )}
                </div>
              </div>

              {msg.sender === Sender.USER && (
                <div className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex-shrink-0 flex items-center justify-center text-gray-300 shadow-sm mt-1">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 md:pb-10 bg-transparent">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[28px] blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative bg-gray-900 rounded-[26px] border border-gray-800 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600/30 transition-all shadow-2xl flex items-end p-2 pr-3">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${activeApp.name}...`}
              className="flex-1 bg-transparent text-white px-5 py-3 rounded-2xl focus:outline-none resize-none max-h-60 overflow-y-auto font-medium leading-relaxed custom-scrollbar"
              style={{ minHeight: '44px' }}
            />
            <div className="flex items-center gap-2 mb-0.5">
              {(activeApp.category === 'creative' || activeApp.id === 'creative-writer') && (
                <button
                  onClick={handleGenerateImage}
                  disabled={!input.trim() || isLoading || isGeneratingImage}
                  title="Generate Image"
                  className={`
                    p-3 rounded-2xl transition-all
                    ${input.trim() && !isLoading && !isGeneratingImage
                      ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-600/30 shadow-lg shadow-purple-600/10 active:scale-90'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed scale-95 opacity-50 border border-gray-800'}
                  `}
                >
                  {isGeneratingImage ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                </button>
              )}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || isGeneratingImage}
                className={`
                  p-3 rounded-2xl transition-all
                  ${input.trim() && !isLoading && !isGeneratingImage
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-90 scale-100'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed scale-95 opacity-50'}
                `}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] uppercase tracking-widest font-bold text-gray-600 mt-4">
          Powered by Silver AI • Cloudflare AI Gateway Protected
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;