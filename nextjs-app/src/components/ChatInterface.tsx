"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Message, Sender, AntDefinition, AppSettings } from '../types';
import IconRenderer from './IconRenderer';
import { streamMessage, generateImage } from '../services/aiGatewayService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatInterfaceProps {
    activeAnt: AntDefinition;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    settings: AppSettings;
    threadId: string | null;
    onThreadUpdate: (thread: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeAnt, messages, setMessages, settings, threadId, onThreadUpdate }) => {
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

            const combinedSystemInstruction = `
${activeAnt.systemInstruction}

[GLOBAL BUSINESS CONTEXT]
Business Name: ${settings.businessName || 'N/A'}
Industry: ${settings.industry || 'General'}
Global Context: ${settings.globalContext || 'No additional context provided.'}
`.trim();

            const stream = streamMessage(userText, combinedSystemInstruction, settings.maxTokens, threadId || undefined, activeAnt.id.toString());

            let result;
            while (true) {
                const { value, done } = await stream.next();
                if (done) {
                    result = value;
                    break;
                }
                if (typeof value === 'string') {
                    fullResponse += value;
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === responseMsgId
                                ? { ...msg, text: fullResponse }
                                : msg
                        )
                    );
                }
            }

            // Finish streaming
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === responseMsgId
                        ? { ...msg, isStreaming: false }
                        : msg
                )
            );

            // Re-fetch thread or refresh applets if provisioned
            if (result) {
                onThreadUpdate({
                    id: threadId || result.thread?.id,
                    forceRefresh: true,
                    provisioned: result.provisioned
                });
            }

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
                    text: `${activeAnt.name} is crafting your image...`,
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
        <div className="flex-1 flex flex-col h-full bg-[#0f0f0f] relative">
            {/* Active Ant Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-2.5 px-4 py-1.5 bg-white/5 rounded-2xl border border-white/10 pointer-events-auto shadow-lg">
                    <div className="w-5 h-5 flex items-center justify-center text-[#c4c4c4]">
                        <IconRenderer name={activeAnt.icon || 'Sparkles'} size={16} />
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">{activeAnt.name}</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-24 md:px-0 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-10">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-[#c4c4c4] mb-8 shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-500 overflow-hidden p-4">
                                <img src="https://silverantmarketing.com/wp-content/uploads/2021/06/header-light-logo-sam.webp" alt={activeAnt.name} className="w-full h-full object-contain" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Meet {activeAnt.name}</h2>
                            <p className="text-gray-400 max-w-md text-lg font-normal leading-relaxed">Your advanced AI strategist specifically tuned for {activeAnt.name}.</p>

                            <div className="mt-10 grid grid-cols-2 gap-3 w-full max-w-sm">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-500 font-medium">
                                    Strategic Insight
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-500 font-medium">
                                    Market Analysis
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
                                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex-shrink-0 flex items-center justify-center text-[#c4c4c4] shadow-sm mt-1 overflow-hidden p-1.5">
                                    <img src="https://silverantmarketing.com/wp-content/uploads/2021/06/header-light-logo-sam.webp" alt={activeAnt.name} className="w-full h-full object-contain" />
                                </div>
                            )}

                            <div
                                className={`
                  max-w-[85%] md:max-w-[80%] px-6 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm font-normal
                  ${msg.sender === Sender.USER
                                        ? 'bg-[#ea580c]/10 text-white rounded-br-none border border-[#ea580c]/20'
                                        : 'bg-black/20 text-gray-200 rounded-bl-none border border-white/5 shadow-black/20'
                                    }
                `}
                            >
                                <div className="font-sans prose prose-invert max-w-none prose-sm">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-extrabold text-[#ea580c]" {...props} />,
                                            h1: ({ node, ...props }) => <h1 className="text-xl font-extrabold mb-4 text-white uppercase tracking-tight" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-lg font-extrabold mb-3 text-white tracking-tight" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-4 space-y-2 text-gray-300" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-4 space-y-2 text-gray-300" {...props} />,
                                            li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                            code: ({ node, ...props }) => <code className="bg-white/5 px-1.5 py-0.5 rounded font-mono text-sm text-[#ea580c]" {...props} />
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                    {msg.imageUrl && (
                                        <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-black/20">
                                            <img src={msg.imageUrl} alt="Generated" className="w-full h-auto object-cover max-h-96" />
                                        </div>
                                    )}
                                    {msg.isStreaming && (
                                        <span className="inline-flex ml-1 items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-[#ea580c] rounded-full animate-pulse" />
                                            <span className="w-1.5 h-1.5 bg-[#ea580c] rounded-full animate-pulse delay-75" />
                                            <span className="w-1.5 h-1.5 bg-[#ea580c] rounded-full animate-pulse delay-150" />
                                        </span>
                                    )}
                                </div>
                            </div>

                            {msg.sender === Sender.USER && (
                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center text-gray-400 shadow-sm mt-1">
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
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-white/5 to-white/10 rounded-[28px] blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <div className="relative bg-white/5 rounded-[26px] border border-white/10 focus-within:ring-2 focus-within:ring-white/10 focus-within:border-white/20 transition-all shadow-2xl flex items-end p-2 pr-3">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Message ${activeAnt.name} for assistance...`}
                            className="flex-1 bg-transparent text-white px-5 py-3 rounded-2xl focus:outline-none resize-none max-h-60 overflow-y-auto font-normal placeholder:font-normal leading-relaxed custom-scrollbar"
                            style={{ minHeight: '44px' }}
                        />
                        <div className="flex items-center gap-2 mb-0.5">
                            {(activeAnt.category === 'creative' || activeAnt.id === 'creative-writer') && (
                                <button
                                    onClick={handleGenerateImage}
                                    disabled={!input.trim() || isLoading || isGeneratingImage}
                                    title="Generate Image"
                                    className={`
                    p-3 rounded-2xl transition-all
                    ${input.trim() && !isLoading && !isGeneratingImage
                                            ? 'bg-white/10 text-[#c4c4c4] hover:bg-white/20 border border-white/20 shadow-lg active:scale-90'
                                            : 'bg-white/5 text-gray-600 cursor-not-allowed scale-95 opacity-50 border border-white/5'}
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
                                        ? 'bg-[#ea580c] text-white hover:bg-[#c2410c] shadow-lg active:scale-90 scale-100'
                                        : 'bg-white/5 text-gray-500 cursor-not-allowed scale-95 opacity-50'}
                `}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
                <p className="text-center text-[10px] uppercase tracking-widest font-bold text-[#c4c4c4]/40 mt-4">
                    Powered by Silver AI • Elite Executive Suite
                </p>
            </div>
        </div>
    );
};

export default ChatInterface;
