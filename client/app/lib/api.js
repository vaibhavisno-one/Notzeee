"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getToken() {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("accessToken");
    }

    setTokens(accessToken, refreshToken) {
        if (typeof window === "undefined") return;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    }

    clearTokens() {
        if (typeof window === "undefined") return;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }

    async request(endpoint, options = {}) {
        const token = this.getToken();
        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
            credentials: "include", // Important for CORS with cookies
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle 401 Unauthorized
                if (response.status === 401) {
                    this.clearTokens();
                    if (typeof window !== "undefined") {
                        window.location.href = "/login";
                    }
                }

                throw new ApiError(data.message || "Request failed", response.status, data);
            }

            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(error.message || "Network error", 500);
        }
    }

    // Auth endpoints
    async register(userData) {
        return this.request("/users/register", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        const data = await this.request("/users/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });

        if (data.data?.accessToken && data.data?.refreshToken) {
            this.setTokens(data.data.accessToken, data.data.refreshToken);
        }

        return data;
    }

    async logout() {
        try {
            await this.request("/users/logout", {
                method: "POST",
            });
        } finally {
            this.clearTokens();
        }
    }

    // Notes endpoints
    async getAllNotes() {
        return this.request("/notes");
    }

    async createNote(noteData) {
        return this.request("/notes", {
            method: "POST",
            body: JSON.stringify(noteData),
        });
    }

    async getNoteById(noteId) {
        return this.request(`/notes/${noteId}`);
    }

    async updateNote(noteId, updates) {
        return this.request(`/notes/${noteId}`, {
            method: "PATCH",
            body: JSON.stringify(updates),
        });
    }

    async deleteNote(noteId) {
        return this.request(`/notes/${noteId}`, {
            method: "DELETE",
        });
    }

    async addCollaborator(noteId, username, role = "editor") {
        return this.request(`/notes/${noteId}/collaborators`, {
            method: "POST",
            body: JSON.stringify({ username, role }),
        });
    }

    async removeCollaborator(noteId, username) {
        return this.request(`/notes/${noteId}/collaborators`, {
            method: "DELETE",
            body: JSON.stringify({ username }),
        });
    }
}

class ApiError extends Error {
    constructor(message, statusCode, data = null) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.data = data;
    }
}

const api = new ApiClient();

export { api, ApiError };
