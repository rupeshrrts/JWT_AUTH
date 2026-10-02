# ⚛️ JWT Authentication Frontend (Next.js 14 + Tailwind CSS)

A responsive, production-ready frontend built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **React Hook Form**, **Zod**, **Lucide Icons**, and **Axios**.

---

## 📑 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step-by-Step Installation & Setup](#2-step-by-step-installation--setup)
3. [Environment Configuration (`.env.local`)](#3-environment-configuration-envlocal)
4. [Running the Frontend](#4-running-the-frontend)
5. [Frontend Architecture & Reusable Components](#5-frontend-architecture--reusable-components)
6. [Drop-In Frontend Integration into Any Existing Project](#6-drop-in-frontend-integration-into-any-existing-project)

---

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher
- **Backend Server**: Running on `http://localhost:5000` (or your production API URL)

---

## 2. Step-by-Step Installation & Setup

Open your terminal in the `frontend/` directory:

```powershell
# Step 1: Navigate to frontend folder
cd frontend

# Step 2: Install all required production dependencies
npm install
```

### Key Packages:
- `next`, `react`, `react-dom`, `typescript`
- `tailwindcss`, `postcss`, `autoprefixer`
- `axios` (withCredentials support)
- `react-hook-form`, `zod`, `@hookform/resolvers`
- `lucide-react` (modern UI icons)

---

## 3. Environment Configuration (`.env.local`)

Create or update `.env.local` inside the `frontend/` folder:

```env
# URL pointing to your backend Express API
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

*In production (e.g. Vercel), set `NEXT_PUBLIC_API_URL` to your live backend domain (e.g. `https://api.yourdomain.com/api`).*

---

## 4. Running the Frontend

### Development Mode:
```powershell
npm run dev
```
*Open your browser to: **`http://localhost:3000`***

### Production Build & Launch:
```powershell
# Build optimized production bundle
npm run build

# Start production server
npm start
```

---

## 5. Frontend Architecture & Reusable Components

### A. Universal `useAuth()` Hook & `<AuthProvider>`
- **Location**: [`src/context/AuthContext.tsx`](file:///c:/Users/pc/Desktop/JWT_Auth/frontend/src/context/AuthContext.tsx)
- Provides global state across the entire application:
  ```tsx
  const { user, isAuthenticated, isLoading, login, register, logout } = useAuth();
  ```

### B. Universal `<ProtectedRoute>` Guard
- **Location**: [`src/components/ProtectedRoute.tsx`](file:///c:/Users/pc/Desktop/JWT_Auth/frontend/src/components/ProtectedRoute.tsx)
- Wrap any page to enforce authentication. If unauthenticated, it automatically redirects the user to `/login`.

### C. Axios Client (`withCredentials: true`)
- **Location**: [`src/lib/api.ts`](file:///c:/Users/pc/Desktop/JWT_Auth/frontend/src/lib/api.ts)
- Automatically includes and receives HttpOnly cookies from the backend.

---

## 6. Drop-In Frontend Integration into Any Existing Project

To plug this authentication system into **any existing Next.js or React application**:

### Step 1: Copy Core Modules
Copy these files into your existing `src/` folder:
- `src/lib/api.ts` ➔ Axios client
- `src/types/auth.ts` ➔ TypeScript interfaces
- `src/services/auth.service.ts` ➔ API caller service
- `src/context/AuthContext.tsx` ➔ Global Auth Hook & Provider
- `src/components/ProtectedRoute.tsx` ➔ Reusable Route Guard

### Step 2: Wrap Root Layout (`app/layout.tsx`):
```tsx
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 3: Guard Any Page with 1 Wrapper:
```tsx
'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function MySecretPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Welcome, {user?.name}!</h1>
        <button onClick={logout}>Sign Out</button>
      </div>
    </ProtectedRoute>
  );
}
```
