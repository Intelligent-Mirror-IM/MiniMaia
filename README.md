# MAIA Online

## Overview

MAIA Online is a Socket.io client that runs on a Raspberry Pi 5 (8GB) and connects to a cloud-based backend to enable chat functionality between the MAIA Smart Mirror and a mobile application. This middleware solution processes emotion data and facilitates communication between the physical mirror and mobile users.

## Architecture

```
Mobile App <--> Cloud Backend <--> MAIA Online (Raspberry Pi 5)
```

In this architecture:

- The MAIA Online service runs locally on the Raspberry Pi 5
- It connects to a cloud backend server at maiasalt.online
- Mobile applications connect to the cloud backend
- The system enables real-time communication between the mobile app and the smart mirror

## Features

- Real-time communication using Socket.io
- Emotion-based responses using OpenAI's GPT-4
- Concise 10-word responses optimized for mirror display
- Client-server architecture connecting the Raspberry Pi to cloud services
- Reliable message forwarding between mobile app and smart mirror

## Requirements

- Raspberry Pi 5 (8GB)
- Node.js v18 or higher
- npm v9 or higher
- OpenAI API key
- Internet connection for cloud backend communication

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/maiaOnline.git
cd maiaOnline
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your OpenAI API key:

```
GPT_KEY=your_openai_api_key
PORT=3000
BACKEND_URL=http://maiasalt.online:5200
```

4. Start the server:

```bash
npm start
```

## How It Works

1. MAIA Online runs on the Raspberry Pi and connects to the cloud backend
2. The mobile application sends requests to the cloud backend
3. The cloud backend forwards these requests to MAIA Online
4. MAIA Online processes the requests using OpenAI's GPT-4
5. Responses are sent back through the same channel to the mobile application
6. The system handles both AI responses and direct messages between devices

## Configuration

- Default port: 3000 (configurable via environment variable)
- Backend URL: http://maiasalt.online:5200
- Socket.io is configured for cross-origin requests
- Automatic reconnection if the connection to backend is lost

## Project Structure

- `index.js` - Main application file with Socket.io client and server setup
- `package.json` - Project dependencies and scripts

## Troubleshooting

If you encounter connection issues:

- Check that the Raspberry Pi has a stable internet connection
- Verify the cloud backend server is running
- Ensure your OpenAI API key is valid
- Check the console logs for specific error messages
- Contact Basil Ismail :D

## Current Status (May 7, 2025)

The system is now fully operational with updated Socket.io event handling and improved reconnection logic. The middleware successfully bridges the communication between the mobile application and the smart mirror interface running on the Raspberry Pi.
