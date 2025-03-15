
import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { toast } from "sonner";

// Types
export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
}

interface ChatState {
  messages: Message[];
  users: User[];
  userId: string | null;
  connected: boolean;
}

type ChatAction =
  | { type: "SET_INITIAL_STATE"; payload: { messages: Message[]; users: User[]; userId: string } }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "ADD_USER"; payload: User }
  | { type: "RENAME_USER"; payload: { id: string; newName: string } }
  | { type: "REMOVE_USER"; payload: string }
  | { type: "SET_CONNECTION_STATUS"; payload: boolean };

interface ChatContextType extends ChatState {
  sendMessage: (content: string) => void;
  setUsername: (name: string) => void;
  currentUser: User | null;
}

// Create context
const ChatContext = createContext<ChatContextType | null>(null);

// Reducer function
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return {
        ...state,
        messages: action.payload.messages,
        users: action.payload.users,
        userId: action.payload.userId,
      };
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "ADD_USER":
      // Check if user already exists
      if (state.users.some((user) => user.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case "RENAME_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id
            ? { ...user, name: action.payload.newName }
            : user
        ),
      };
    case "REMOVE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };
    case "SET_CONNECTION_STATUS":
      return {
        ...state,
        connected: action.payload,
      };
    default:
      return state;
  }
};

// WebSocket chat provider
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    users: [],
    userId: null,
    connected: false,
  });
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const currentUser = state.userId
    ? state.users.find((user) => user.id === state.userId) || null
    : null;

  // Connect to WebSocket
  useEffect(() => {
    // Prevent reconnection attempts if we already have a connection
    if (socket && socket.readyState === WebSocket.OPEN) {
      return;
    }

    // Use window.location to determine the WebSocket URL
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.hostname}:3000`;
    
    const ws = new WebSocket(wsUrl);

    ws.addEventListener("open", () => {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: true });
      if (reconnectAttempt > 0) {
        toast.success("Reconnected to chat server");
      } else {
        toast.success("Connected to chat server");
      }
      setReconnectAttempt(0);
    });

    ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case "init":
            dispatch({
              type: "SET_INITIAL_STATE",
              payload: {
                messages: data.data.messages,
                users: data.data.users,
                userId: data.data.userId,
              },
            });
            break;
          
          case "new-message":
            dispatch({ type: "ADD_MESSAGE", payload: data.data });
            break;
          
          case "user-joined":
            dispatch({ type: "ADD_USER", payload: data.data });
            toast.info(`${data.data.name} joined the chat`);
            break;
          
          case "user-renamed":
            dispatch({
              type: "RENAME_USER",
              payload: { id: data.data.id, newName: data.data.newName },
            });
            toast.info(`${data.data.oldName} renamed to ${data.data.newName}`);
            break;
          
          case "user-left":
            dispatch({ type: "REMOVE_USER", payload: data.data.id });
            const leftUser = state.users.find((user) => user.id === data.data.id);
            if (leftUser) {
              toast.info(`${leftUser.name} left the chat`);
            }
            break;
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.addEventListener("close", () => {
      if (state.connected) {
        dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
        toast.error("Disconnected from chat server");
        
        // Only attempt reconnection if we were previously connected
        const nextAttempt = reconnectAttempt + 1;
        setReconnectAttempt(nextAttempt);
        
        // Implement exponential backoff for reconnection
        const delay = Math.min(Math.pow(2, nextAttempt) * 1000, 30000);
        
        setTimeout(() => {
          // Don't show multiple "attempting to reconnect" messages
          if (nextAttempt < 5) {
            toast.info("Attempting to reconnect...");
          }
        }, delay);
      }
    });

    ws.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      // Only show error once, not on every reconnect attempt
      if (reconnectAttempt === 0) {
        toast.error("Connection error");
      }
    });

    setSocket(ws);

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [reconnectAttempt]);

  // Send message function
  const sendMessage = (content: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !content.trim()) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "message",
        content: content.trim(),
      })
    );
  };

  // Set username function
  const setUsername = (name: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !name.trim()) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "set-name",
        name: name.trim(),
      })
    );
  };

  const contextValue: ChatContextType = {
    ...state,
    sendMessage,
    setUsername,
    currentUser,
  };

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

// Hook to use the chat context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
