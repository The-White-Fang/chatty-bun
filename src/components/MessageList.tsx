
import React, { useEffect, useRef } from "react";
import { useChat, Message } from "@/context/ChatContext";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

const MessageList: React.FC = () => {
  const { messages, users, userId } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Find username by ID
  const getUsernameById = (id: string) => {
    const user = users.find((user) => user.id === id);
    return user ? user.name : "Unknown User";
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Check if a message is from the current user
  const isOwnMessage = (message: Message) => message.sender === userId;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((message) => {
          const isOwn = isOwnMessage(message);
          
          return (
            <motion.div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-[80%] ${
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-t-lg rounded-bl-lg"
                    : "bg-secondary text-secondary-foreground rounded-t-lg rounded-br-lg"
                } px-4 py-3 shadow-sm`}
              >
                {!isOwn && (
                  <div className="text-xs font-medium mb-1">
                    {getUsernameById(message.sender)}
                  </div>
                )}
                <div className="break-words">{message.content}</div>
                <div
                  className={`text-xs ${
                    isOwn ? "text-primary-foreground/70" : "text-secondary-foreground/70"
                  } mt-1 text-right`}
                >
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
