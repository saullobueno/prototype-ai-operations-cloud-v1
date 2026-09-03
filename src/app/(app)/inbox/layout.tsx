import type { ReactNode } from "react";
import { ConversationList } from "@/features/conversations/conversation-list";

export default function InboxLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100svh-4rem)]">
      <ConversationList />
      <div className="flex min-w-0 flex-1">{children}</div>
    </div>
  );
}
