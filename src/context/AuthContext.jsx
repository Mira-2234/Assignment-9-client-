"use client";
import { createContext, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const { data: session, status } = useSession();

    const user    = session?.user ?? null;
    const loading = status === "loading";

    const googleLogin = () => signIn("google");

    const logout = () => signOut({ callbackUrl: "/" });

    return (
        <AuthContext.Provider value={{ user, loading, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
};