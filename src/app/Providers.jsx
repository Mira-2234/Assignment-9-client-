"use client";

import { SessionProvider } from "next-auth/react";
import AuthProvider from "../context/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}