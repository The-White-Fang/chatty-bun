
import React from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import UserList from "./UserList";
import UsernameModal from "./UsernameModal";
import { ChatProvider } from "@/context/ChatContext";
import { AnimatePresence, motion } from "framer-motion";

const ChatContainer: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex flex-col md:flex-row h-[100svh] w-full overflow-hidden">
        {/* Main chat area */}
        <motion.div 
          className="flex-1 flex flex-col overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <MessageList />
          <MessageInput />
        </motion.div>
        
        {/* Sidebar for user list (visible on larger screens) */}
        <motion.div 
          className="hidden md:block w-64 border-l border-border bg-card overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <UserList />
        </motion.div>
        
        {/* Username modal */}
        <UsernameModal />
      </div>
    </ChatProvider>
  );
};

export default ChatContainer;
