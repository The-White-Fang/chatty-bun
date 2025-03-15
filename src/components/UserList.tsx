
import React from "react";
import { useChat } from "@/context/ChatContext";
import { AnimatePresence, motion } from "framer-motion";
import { User, Users } from "lucide-react";

const UserList: React.FC = () => {
  const { users, userId } = useChat();

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-medium">Users Online ({users.length})</h2>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2">
        <AnimatePresence initial={false}>
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-3 p-3 rounded-md ${
                user.id === userId ? "bg-accent" : "hover:bg-secondary"
              } transition-colors`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                user.id === userId ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}>
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {user.name}
                  {user.id === userId && " (You)"}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserList;
