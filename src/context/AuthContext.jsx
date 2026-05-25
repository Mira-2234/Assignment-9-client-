"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = async () => {
    setUser(null);
  };

  const authInfo = {
    user,
    setUser,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// ✅ THIS IS THE IMPORTANT PART
export const useAuth = () => {
  return useContext(AuthContext);
};