"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // VS Code / App State
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [showMetadata, setShowMetadata] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Load notes from backend
    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            setIsLoading(true);
            const response = await api.getAllNotes();
            setNotes(response.data || []);
            setError(null);
        } catch (err) {
            console.error("Failed to load notes:", err);
            setError(err.message);
            setNotes([]);
        } finally {
            setIsLoading(false);
        }
    };

    const saveNote = async (id, newTitle, newContent) => {
        try {
            // Optimistic update
            const updated = notes.map((n) =>
                n._id === id
                    ? { ...n, title: newTitle, content: newContent, updatedAt: new Date().toISOString() }
                    : n
            );
            setNotes(updated);

            // API call
            await api.updateNote(id, { title: newTitle, content: newContent });
        } catch (err) {
            console.error("Failed to save note:", err);
            // Reload notes on error to sync state
            loadNotes();
        }
    };

    const createNote = async () => {
        try {
            const response = await api.createNote({
                title: "",
                content: "",
            });

            const newNote = response.data;
            setNotes((prev) => [newNote, ...prev]);
            return newNote._id;
        } catch (err) {
            console.error("Failed to create note:", err);
            setError(err.message);
            return null;
        }
    };

    const deleteNote = async (id) => {
        try {
            await api.deleteNote(id);
            setNotes((prev) => prev.filter((n) => n._id !== id));
        } catch (err) {
            console.error("Failed to delete note:", err);
            setError(err.message);
        }
    };

    const addCollaborator = async (noteId, username, role = "editor") => {
        try {
            const response = await api.addCollaborator(noteId, username, role);
            const updatedNote = response.data;

            setNotes((prev) =>
                prev.map((n) => (n._id === noteId ? updatedNote : n))
            );

            return { success: true };
        } catch (err) {
            console.error("Failed to add collaborator:", err);
            return { success: false, error: err.message };
        }
    };

    const removeCollaborator = async (noteId, username) => {
        try {
            const response = await api.removeCollaborator(noteId, username);
            const updatedNote = response.data;

            setNotes((prev) =>
                prev.map((n) => (n._id === noteId ? updatedNote : n))
            );

            return { success: true };
        } catch (err) {
            console.error("Failed to remove collaborator:", err);
            return { success: false, error: err.message };
        }
    };

    return (
        <NotesContext.Provider
            value={{
                notes,
                isLoading,
                error,
                saveNote,
                createNote,
                deleteNote,
                addCollaborator,
                removeCollaborator,
                loadNotes,
                isFocusMode,
                setIsFocusMode,
                showMetadata,
                setShowMetadata,
                searchQuery,
                setSearchQuery,
            }}
        >
            {children}
        </NotesContext.Provider>
    );
}

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) throw new Error("useNotes must be used within NotesProvider");
    return context;
};
