import type { Metadata } from "next";
import ChatWindowClient from "@/components/chat/ChatWindowClient";

export const metadata: Metadata = {
  title: "Chat | AgriGov",
  description: "Chat with farmer/buyer",
};

export default async function ChatWindowRoute({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <ChatWindowClient conversationId={parseInt(id)} />;
}