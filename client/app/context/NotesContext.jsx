"use client";

import { createContext, useContext, useState, useEffect } from "react";

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // VS Code / App State
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [showMetadata, setShowMetadata] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem("notzeee_notes");
        if (saved) {
            setNotes(JSON.parse(saved));
        } else {
            // Default seed data with new fields
            const seed = [
                { id: "1", title: "Project Ideas", content: "Build a developer notes app...", tags: ["dev", "ideas"], pinned: true, updatedAt: new Date().toISOString() },
                { id: "2", title: "Deployment Config", content: "Vercel settings...", tags: ["devops"], pinned: false, updatedAt: new Date().toISOString() }
            ];
            setNotes(seed);
            localStorage.setItem("notzeee_notes", JSON.stringify(seed));
        }
        setIsLoading(false);
    }, []);

    // Persist helper
    const persistNotes = (updatedNotes) => {
        setNotes(updatedNotes);
        localStorage.setItem("notzeee_notes", JSON.stringify(updatedNotes));
    };

    const saveNote = (id, newTitle, newContent) => {
        const updated = notes.map((n) =>
            n.id === id
                ? { ...n, title: newTitle, content: newContent, updatedAt: new Date().toISOString() }
                : n
        );
        persistNotes(updated);
    };

    const createNote = () => {
        const newNote = {
            id: Date.now().toString(),
            title: "",
            content: "",
            tags: [],
            pinned: false,
            updatedAt: new Date().toISOString()
        };
        const updated = [newNote, ...notes];
        persistNotes(updated);
        return newNote.id;
    };

    const togglePin = (id) => {
        const updated = notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
        persistNotes(updated);
    };

    const addTag = (id, tag) => {
        const updated = notes.map(n => {
            if (n.id === id) {
                if (n.tags && n.tags.includes(tag)) return n;
                return { ...n, tags: [...(n.tags || []), tag] };
            }
            return n;
        });
        persistNotes(updated);
    };

    const removeTag = (id, tag) => {
        const updated = notes.map(n => {
            if (n.id === id) {
                return { ...n, tags: (n.tags || []).filter(t => t !== tag) };
            }
            return n;
        });
        persistNotes(updated);
    };

    return (
        <NotesContext.Provider value={{
            notes,
            isLoading,
            saveNote,
            createNote,
            togglePin,
            addTag,
            removeTag,
            isFocusMode,
            setIsFocusMode,
            showMetadata,
            setShowMetadata,
            searchQuery,
            setSearchQuery
        }}>
            {children}
        </NotesContext.Provider>
    );
}

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) throw new Error("useNotes must be used within NotesProvider");
    return context;
};
