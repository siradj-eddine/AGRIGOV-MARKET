"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { chatApi, ApiError } from "@/lib/api";
import type { ConversationDetail, ChatMessage } from "@/lib/api";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

export default function ChatWindowClient({ conversationId }: { conversationId: number }) {
  const router = useRouter();
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const role = getCookie("role");

  useEffect(() => {
    loadConversation();
    const interval = setInterval(loadConversation, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const loadConversation = async () => {
    try {
      const data = await chatApi.detail(conversationId);
      setConversation(data);
      setMessages(data.messages || []);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push("/Login");
      }
    }
    setLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await chatApi.sendMessage(conversationId, newMessage.trim());
      setNewMessage("");
      await loadConversation();
    } catch (err) {
      alert("Failed to send message.");
    }
    setSending(false);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    
    return d.toLocaleDateString("fr-DZ", { day: "2-digit", month: "short" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-slate-500 text-sm">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!conversation) return null;

  const otherUser = role === "BUYER" ? conversation.farmer : conversation.buyer;

  // Group messages by date
  const groupedMessages = messages.reduce((groups: Record<string, ChatMessage[]>, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString("fr-DZ", { 
      weekday: "long", day: "2-digit", month: "long" 
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col bg-white dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center gap-3 bg-white dark:bg-surface-dark shadow-sm">
        <button 
          onClick={() => router.push("/chat")} 
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-green-400 flex items-center justify-center shadow-sm">
          <span className="text-white text-sm font-bold">
            {otherUser.username.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-900 dark:text-white">
            {otherUser.username}
          </p>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-linear-to-b from-slate-50/50 to-white dark:from-neutral-900 dark:to-neutral-900">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">chat</span>
            </div>
            <p className="text-slate-400 font-medium">No messages yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Send a message to start the conversation with {otherUser.username}
            </p>
          </div>
        )}
        
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className="space-y-2">
            {/* Date divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800"></div>
              <span className="text-xs text-slate-400 font-medium px-3 py-1 bg-slate-100 dark:bg-neutral-800 rounded-full">
                {date}
              </span>
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800"></div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-1.5">
              {msgs.map((msg, i) => {
                const isMine = msg.sender.role === role;
                const showAvatar = !isMine && (i === 0 || msgs[i - 1]?.sender.id !== msg.sender.id);
                
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
                    {/* Avatar for other user */}
                    {!isMine && showAvatar && (
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-primary to-green-400 flex items-center justify-center shrink-0 mb-1">
                        <span className="text-white text-xs font-bold">
                          {msg.sender.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {!isMine && !showAvatar && <div className="w-7 shrink-0" />}
                    
                    <div className={`max-w-[70%] group`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMine
                            ? "bg-primary text-black rounded-br-lg"
                            : "bg-white dark:bg-surface-dark text-slate-800 dark:text-slate-200 rounded-bl-lg border border-neutral-100 dark:border-neutral-700 shadow-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <p className={`text-[10px] mt-0.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isMine ? "text-right text-slate-400" : "text-left text-slate-400"
                      }`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                    
                    {/* Avatar for own messages */}
                    {isMine && (
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0 mb-1">
                        <span className="text-white text-xs font-bold">
                          {role === "BUYER" ? "B" : "F"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-end gap-2 bg-white dark:bg-surface-dark shadow-lg"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          autoFocus
          className="flex-1 px-5 py-3 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-sm bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="p-3 bg-primary text-black rounded-full hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md"
        >
          {sending ? (
            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-xl">send</span>
          )}
        </button>
      </form>
    </div>
  );
}