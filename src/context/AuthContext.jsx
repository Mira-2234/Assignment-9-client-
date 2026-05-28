"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";

const AuthContext = createContext(null);
const API = process.env.NEXT_PUBLIC_API_URL

export function AuthProvider({ children }) {
    const { data: session, status } = useSession();
    const [emailUser, setEmailUser] = useState(null);
    const loading = status === "loading";

    
    const user = session?.user || emailUser;

    useEffect(() => {
        if (session?.user) {
            axios.post(
                `${API}/auth/token`,
                {
                    email:    session.user.email,
                    name:     session.user.name,
                    photoURL: session.user.image,
                },
                { withCredentials: true }
            ).catch(() => {});
        }
    }, [session]);

    const googleLogin = () => signIn("google");

    // Email/Password login
 const login = async (email, password) => {
    const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
    });

    if (res?.error) {
        throw new Error("Invalid email or password");
    }

    return res;
};

    // Register
    const register = async (name, email, photoURL, password) => {
        const res = await axios.post(
            `${API}/register`,
            { name, email, photoURL, password },
            { withCredentials: true }
        );
        setEmailUser(res.data.user);
        return res.data;
    };

    const logout = async () => {
        await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
        setEmailUser(null);
        if (session) signOut({ callbackUrl: "/" });
    };

   return (
  <AuthContext.Provider
    value={{
      user,
      loading,
      login,
      register,
      googleLogin,
      logout,
    }}
  >
    {children}
  </AuthContext.Provider>
);
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
};