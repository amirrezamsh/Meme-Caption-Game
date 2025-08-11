// AuthContext.jsx
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  const loginUser = (user) => {
    setUsername(user.username);
  };

  const logout = () => {
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
