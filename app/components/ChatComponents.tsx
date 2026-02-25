"use client";

import React, { useRef, useEffect } from "react";




export type Message = {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
};

interface MessageBubbleProps {
    message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === "user";

    return (
        <div
            className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
        >
            <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-xl ${isUser
                    ? "bg-violet-600 text-white text-white rounded-tr-none"
                    : "bg-slate-800 text-slate-100 dark:text-zinc-100 rounded-tl-none border-white/20"
                    }`}
            >
                <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                <span
                    className={`text-[10px] mt-1.5 block opacity-50 font-medium ${isUser ? "text-right" : "text-left"
                        }`}
                >
                    {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>
        </div>
    );
};

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSendMessage,
    isLoading,
}) => {
    const [input, setInput] = React.useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [input]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput("");
        }
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-zinc-50/90 dark:from-black/90 to-transparent z-40">
            <form
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto flex items-end gap-3 p-3 bg-zinc-900  rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/20"
            >
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 border-none outline-none  focus:ring-0 resize-none py-3 px-4 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 leading-relaxed text-base min-h-[48px] max-h-[200px]"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="bg-zinc-900 dark:bg-white hover:scale-105 active:scale-95 disabled:opacity-20 text-white dark:text-zinc-900 p-4 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center h-12 w-12 mb-0.5"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                            />
                        </svg>
                    )}
                </button>
            </form>
        </footer>
    );
};
