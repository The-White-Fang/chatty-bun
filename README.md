
# Real-time Chat Application

A real-time chat application built with React, TypeScript, and Bun's WebSocket server implementation.

## Features

- Real-time messaging using WebSocket
- User presence tracking (join/leave notifications)
- Username customization with persistence
- Toast notifications for user events
- Persistent message history (server-side, up to 500 messages)
- Modern UI with dark/light mode support
- Responsive design

## Prerequisites

This project requires [Bun](https://bun.sh) to be installed on your system.

### Installing Bun

```bash
# For macOS, Linux, and WSL
curl -fsSL https://bun.sh/install | bash

# For Windows (via PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the WebSocket server:
   ```bash
   bun run src/server/index.ts
   ```

4. In a separate terminal, start the React development server:
   ```bash
   bun run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Project Structure

- `/src/server` - WebSocket server implementation
- `/src/components` - React UI components
- `/src/context` - React context for state management
- `/src/hooks` - Custom React hooks
- `/src/pages` - Page components for routing

## Key Features Implementation

- **Username Persistence**: Usernames are saved in localStorage to prevent prompting on every visit
- **Real-time Communication**: WebSocket connection maintains real-time communication
- **User Events**: Join/leave notifications and username changes are broadcast to all users
- **Message History**: Server keeps track of the last 500 messages

## Development

### Available Scripts

- `bun run dev` - Start the development server
- `bun run build` - Build the production version
- `bun run preview` - Preview the production build locally

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Vite

- **Backend**:
  - Bun (for WebSocket server)

## License

MIT

## Project Status

This project is actively maintained. After making changes, remember to commit them:

```bash
git add .
git commit -m "Your commit message"
git push
```
