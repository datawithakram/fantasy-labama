# ⚽ Fantasy Labama - Full Stack Fantasy Football Platform

Fantasy Labama is a comprehensive, production-grade fantasy football application. This repository is organized as a monorepo containing the main player application, an administrative dashboard, and a robust backend simulation engine.

## 🏗️ Project Structure

The project is divided into three main components:

### 1. 📱 [Frontend (Player App)](./frontend)

The core application where users build their teams, track scores, and compete in leagues.

- **Tech Stack**: React 19, Vite, TypeScript, Tailwind CSS.
- **Key Features**: Team Builder, Live Match Center, Transfers, Leaderboard, and Profile management.
- **Mobile Support**: Integrated with **Capacitor** to allow building native Android/iOS APKs.

### 2. 🛡️ [Admin Panel](./admin-panel)

A dedicated dashboard for administrators to manage the game state.

- **Tech Stack**: React, Vite, Lucide Icons.
- **Key Features**: Match event management (Goals, Assists, Cards), Player database management, and Gameweek control.

### 3. ⚙️ [Backend Engine](./backend-engine)

The "brain" of the application that handles simulations and data synchronization.

- **Tech Stack**: Node.js, Express.
- **Key Features**: Live match day simulation, automated point calculation, and Supabase/Firebase integration.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for database and auth)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/datawithakram/fantasy-labama.git
   cd fantasy-labama
   ```
2. **Setup Frontend**:

   ```bash
   cd frontend
   npm install
   # Create a .env file with your Supabase/Firebase credentials
   npm run dev
   ```
3. **Setup Admin Panel**:

   ```bash
   cd ../admin-panel
   npm install
   # Create a .env file
   npm run dev
   ```
4. **Setup Backend**:

   ```bash
   cd ../backend-engine
   npm install
   # Create a .env file with SUPABASE_SERVICE_ROLE_KEY
   node index.js
   ```

---

## 📱 Mobile Application (APK)

This project is pre-configured with **Capacitor**. To build the Android app:

1. Navigate to the `frontend` or `admin-panel` folder.
2. Run `npm run build`.
3. Sync Capacitor: `npx cap sync`.
4. Open in Android Studio: `npx cap open android`.
5. Build the APK from Android Studio (Build > Build APK).

---

## 🌐 Deployment Recommendations

- **Frontend/Admin**: Recommended to use **Cloudflare Pages** for unlimited bandwidth and high performance.
- **Backend**: Recommended to use **Render.com** or **Railway.app** for persistent Node.js hosting.
- **Database**: Already powered by **Supabase** (Cloud-native).

---

## 🔒 Security Notice

The `.env` files containing sensitive API keys and Secret Roles are excluded from this repository for security reasons. Please ensure you create your own environment variables based on the provided templates.

---

## 👨‍💻 Author

**Akram** - [GitHub Profile](https://github.com/datawithakram)
