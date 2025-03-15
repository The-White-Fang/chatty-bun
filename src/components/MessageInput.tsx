
import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const MessageInput: React.FC = () => {
  const { sendMessage, connected, currentUser } = useChat();
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim() && connected) {
      sendMessage(message);
      setMessage("");
    }
  };

  // Handle key press events
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  return (
    <motion.div 
      className="border-t border-border bg-card p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-end gap-2"
      >
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={connected ? "Type a message..." : "Connecting..."}
            disabled={!connected || !currentUser}
            className="w-full bg-background resize-none px-4 py-3 rounded-lg border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition duration-200 min-h-[44px] max-h-[150px]"
            rows={1}
          />
        </div>
        <AnimatePresence mode="wait">
          {!connected ? (
            <motion.div
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[44px] w-[44px] flex items-center justify-center"
            >
              <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="connected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                type="submit"
                size="icon"
                disabled={!message.trim() || !connected || !currentUser}
                className="h-[44px] w-[44px]"
              >
                <Send className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default MessageInput;
