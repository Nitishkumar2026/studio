# AI Carousel Generator 🚀

An AI-powered social media carousel generator that converts a topic into a high-quality, 5-slide storytelling carousel. Built for content creators and social media marketers.

## Features
- ✨ **AI Generation**: Powered by OpenAI (GPT-3.5-turbo/4o).
- 📱 **Premium UI**: Modern, glassmorphic design with Tailwind CSS and Framer Motion.
- ✍️ **Edit & Customize**: Each slide can be edited before exporting.
- 📋 **Copy to Clipboard**: Quick copy functionality for easy distribution.
- 🔋 **Responsive**: Beautifully optimized for mobile and desktop.

## Folder Structure
- `/api`: Node.js + Express backend.
- `/client`: React + Vite + Tailwind CSS frontend.

## Step-by-Step Run Instructions

### 1. Prerequisites
- Node.js installed on your machine.
- An OpenAI API Key.

### 2. Backend Setup
1. Open a terminal and navigate to the `api` folder:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Open `.env` and add your OpenAI API Key:
   ```env
   OPENAI_API_KEY=your_actual_key_here
   ```
5. Start the server:
   ```bash
   node index.js
   ```
   *The server will run at http://localhost:5000*

### 3. Frontend Setup
1. Open a new terminal and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide React, Framer Motion, Axios.
- **Backend**: Node.js, Express, OpenAI SDK, Dotenv, Cors.
- **AI**: OpenAI API.
