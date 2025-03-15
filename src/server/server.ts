
import { Server } from "bun";

// Interfaces
interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}

interface Client {
  id: string;
  name: string;
  ws: WebSocket;
}

// In-memory storage
const clients: Client[] = [];
const messages: ChatMessage[] = [];

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 10);

// Broadcast message to all clients
const broadcast = (data: any) => {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
};

// Handle new WebSocket connection
function handleWebSocketConnection(ws: WebSocket) {
  let clientId = generateId();
  let clientName = `Guest-${clientId.substring(0, 4)}`;

  // Add client to the list
  clients.push({ id: clientId, name: clientName, ws });

  // Send current messages and users to the new client
  ws.send(
    JSON.stringify({
      type: "init",
      data: {
        messages: messages.slice(-50), // Send last 50 messages
        users: clients.map((c) => ({ id: c.id, name: c.name })),
        userId: clientId,
      },
    })
  );

  // Notify others about new user
  broadcast({
    type: "user-joined",
    data: { id: clientId, name: clientName },
  });

  // Handle incoming messages
  ws.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data as string);

      switch (data.type) {
        case "message": {
          // Create new message
          const message: ChatMessage = {
            id: generateId(),
            sender: clientId,
            content: data.content,
            timestamp: Date.now(),
          };

          // Store and broadcast message
          messages.push(message);
          if (messages.length > 500) messages.shift(); // Limit storage
          
          broadcast({
            type: "new-message",
            data: message,
          });
          break;
        }
        
        case "set-name": {
          // Update client name
          const client = clients.find((c) => c.id === clientId);
          if (client) {
            const oldName = client.name;
            client.name = data.name;
            
            // Notify all clients about name change
            broadcast({
              type: "user-renamed",
              data: { id: clientId, oldName, newName: data.name },
            });
          }
          break;
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // Handle client disconnection
  ws.addEventListener("close", () => {
    // Remove client from list
    const index = clients.findIndex((c) => c.id === clientId);
    if (index !== -1) {
      clients.splice(index, 1);
      
      // Notify other clients
      broadcast({
        type: "user-left",
        data: { id: clientId },
      });
    }
  });
}

// Create and start server
export function startChatServer(port: number = 3000): Server {
  return Bun.serve({
    port,
    fetch(req, server) {
      // Upgrade HTTP request to WebSocket
      if (server.upgrade(req)) {
        return; // Return if upgrade was successful
      }
      
      // Return 404 for all other routes
      return new Response("Not Found", { status: 404 });
    },
    websocket: {
      open: handleWebSocketConnection,
      message(ws, message) {
        // Message handling is done in the open handler
      },
      close(ws, code, message) {
        // Close handling is done in the open handler's close event listener
      },
    },
  });
}

// Start server if this file is executed directly
if (import.meta.main) {
  const port = 3000;
  const server = startChatServer(port);
  console.log(`Chat server running at http://localhost:${port}`);
}
