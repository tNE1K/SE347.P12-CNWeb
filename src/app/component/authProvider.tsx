"use client";
import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Retrieve token and user from localStorage when the component first loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.get("http://localhost:5000/auth/verify", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);  // This should run only once when the component mounts

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", { email, password });

      const user = response.data.user;
      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);  // Store the token
        setUser(user);  // Set the user
        router.push("/");  // Redirect to the home page
      } else {
        console.error("No token in response");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials or server error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);  // Remove user on logout
    router.push("/");  // Redirect to home page
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
