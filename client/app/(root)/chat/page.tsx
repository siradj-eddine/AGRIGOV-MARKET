import type { Metadata } from "next";
import ChatInboxPage from "@/components/chat/ChatInboxPageClient";

export const metadata: Metadata = {
  title: "Messages | AgriGov",
  description: "Your conversations with farmers and buyers",
};

export default function ChatInboxRoute() {
  return <ChatInboxPage />;
}