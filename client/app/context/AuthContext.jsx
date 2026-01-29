"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = api.getToken();
        if (token) {
            try {
                // Fetch current user from backend
                const response = await api.getCurrentUser();
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                // Token invalid or expired
                console.error("Auth check failed:", error);
                api.clearTokens();
                setUser(null);
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
        setIsLoading(false);
    };

    const login = async (credentials) => {
        try {
            const response = await api.login(credentials);
            setUser(response.data.user);
            setIsAuthenticated(true);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.register(userData);
            // Auto-login after registration
            if (response.data) {
                const loginResult = await login({
                    username: userData.username,
                    password: userData.password,
                });
                return loginResult;
            }
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await api.logout();
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            if (typeof window !== "undefined") {
                window.location.href = "/";
            }
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
