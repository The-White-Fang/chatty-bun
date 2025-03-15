import React, { useState, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";

const UsernameModal: React.FC = () => {
  const { currentUser, setUsername, connected } = useChat();
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Show modal when connected and no username is set
  useEffect(() => {
    // Check if username is already saved in localStorage
    const savedUsername = localStorage.getItem("chatUsername");
    
    if (connected && currentUser) {
      if (savedUsername) {
        // If we have a saved username, set it without showing modal
        setUsername(savedUsername);
      } else {
        // Otherwise show the modal with current name
        setName(currentUser.name);
        setShowModal(true);
      }
    }
  }, [connected, currentUser, setUsername]);

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Save username to localStorage to persist across sessions
      localStorage.setItem("chatUsername", name);
      setUsername(name);
      setShowModal(false);
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-md overflow-hidden glass rounded-xl shadow-lg"
          >
            <div className="p-6">
              <h2 className="text-xl font-medium mb-4">Welcome to the Chat</h2>
              <p className="text-muted-foreground mb-6">
                Choose a username to start chatting.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your username"
                    className="w-full"
                    autoFocus
                  />
                  
                  <Button type="submit" className="w-full">
                    Continue to Chat
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UsernameModal;
