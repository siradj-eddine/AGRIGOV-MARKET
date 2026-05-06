"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { chatApi, ApiError } from "@/lib/api";
import type { ConversationListItem } from "@/lib/api";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

export default function ChatInboxPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (pathname === "/chat") {
      loadConversations();
    }
  }, [pathname]);

  const loadConversations = async () => {
    try {
      const data = await chatApi.list();
      setConversations(Array.isArray(data) ? data : (data as any).results || []);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push("/Login");
      }
    }
    setLoading(false);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 6) return `${hours}h`;
    if (hours < 24) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (hours < 48) return "Yesterday";
    return d.toLocaleDateString("fr-DZ", { day: "2-digit", month: "short" });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-slate-500">Loading messages...</p>
      </div>
    );
  }

  const role = getCookie("role");
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">chat</span>
            Messages
          </h1>
          {totalUnread > 0 && (
            <p className="text-sm text-slate-400 mt-1">{totalUnread} unread message{totalUnread > 1 ? "s" : ""}</p>
          )}
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">forum</span>
          </div>
          <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">No conversations yet</p>
          <p className="text-sm text-slate-400 mt-1 max-w-xs">
            {role === "BUYER"
              ? "Browse the marketplace and click \"Chat with Farmer\" on any product."
              : "When a buyer messages you, conversations will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => router.push(`/chat/${conv.id}`)}
              className="w-full text-left flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-all group"
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-primary to-green-400 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-lg">
                    {(role === "BUYER" 
                      ? conv.farmer.username 
                      : conv.buyer.username
                    ).charAt(0).toUpperCase()}
                  </span>
                </div>
                {conv.unread_count > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {conv.unread_count}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={`font-semibold text-sm truncate ${
                    conv.unread_count > 0 
                      ? "text-slate-900 dark:text-white" 
                      : "text-slate-600 dark:text-slate-400"
                  }`}>
                    {role === "BUYER" ? conv.farmer.username : conv.buyer.username}
                  </p>
                  {conv.last_message && (
                    <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                      {formatTime(conv.last_message.created_at)}
                    </span>
                  )}
                </div>
                
                {conv.last_message ? (
                  <p className={`text-sm truncate ${
                    conv.unread_count > 0 
                      ? "text-slate-800 dark:text-slate-200 font-medium" 
                      : "text-slate-400"
                  }`}>
                    {conv.last_message.content}
                  </p>
                ) : (
                  <p className="text-sm text-slate-300 dark:text-slate-600 italic">
                    No messages yet
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}