"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ConversationPanel } from "@/features/conversations/conversation-panel";
import { CustomerContextPanel } from "@/features/conversations/customer-context-panel";
import { getConversationById, getCustomerById } from "@/data/mock";

export default function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = use(params);
  const conversation = getConversationById(conversationId);
  if (!conversation) notFound();
  const customer = getCustomerById(conversation.customerId);
  if (!customer) notFound();

  return (
    <>
      <ConversationPanel conversation={conversation} />
      <CustomerContextPanel customer={customer} />
    </>
  );
}
