
import { startChatServer } from "./server";

// Start the WebSocket server on port 3000
const server = startChatServer(3000);
console.log(`Chat server running on port ${server.port}`);
