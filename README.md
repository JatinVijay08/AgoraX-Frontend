# AgoraX - The Public Square (Frontend)

The visually stunning, highly interactive React frontend for **AgoraX**. Built with modern web technologies, it features a bespoke "Athenian Night" aesthetic inspired by the ancient Greek marketplace of ideas.

## 🚀 Tech Stack

- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS (Custom Design System)
- **Animations**: Anime.js (Micro-interactions, ambient glows)
- **Routing**: React Router DOM
- **State Management**: Context API
- **HTTP Client**: Axios (with global interceptors)
- **Icons & Typography**: Google Material Symbols, Google Fonts (`Cinzel`, `Inter`)

## ✨ Core Features

- **Athenian Night Aesthetic**: A unique, premium dark-mode UI with Aegean Navy backgrounds, Greek Gold accents, and subtle classical patterns.
- **Cinematic Typography**: Uses the monumental `Cinzel` serif font for a historical, epic feel, paired with modern sans-serifs for readability.
- **Dynamic Micro-Interactions**: Hover effects, smooth page transitions, and drifting ambient background glows powered by Anime.js.
- **Rich Media**: Markdown support for post creation and Cloudinary integration for image uploads.
- **Real-Time UX**: Toast notification system for immediate feedback on user actions (like upvoting or commenting).
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Environment Variables
Currently, the frontend uses hardcoded backend URLs pointing to `localhost:8080` (or dynamic relative paths in production). If you plan to deploy, ensure you update the Axios base URL in `api.js` or configure environment variables accordingly.

*(Note: The Google OAuth Client ID is intentionally public and safely embedded in the authentication components.)*

### Running the App
1. Clone the repository and navigate to the frontend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
The application will be available at `http://localhost:5173`.

## 🎨 Design Philosophy
AgoraX avoids generic "vibecoding" by embracing a cohesive theme. Every component—from the sharpened "Become a Citizen" buttons to the `account_balance` temple logo—is designed to make the user feel like they are participating in a grand public assembly.
