"use client";

import { createContext, useContext, useState, useEffect } from "react";

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState([]);
    const [notebooks, setNotebooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // VS Code / App State
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [showMetadata, setShowMetadata] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Load from LocalStorage
    useEffect(() => {
        const savedNotes = localStorage.getItem("notzeee_notes");
        const savedNotebooks = localStorage.getItem("notzeee_notebooks");

        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        } else {
            // Default seed data with new fields
            const seed = [
                {
                    id: "1",
                    title: "Project Ideas",
                    content: "Build a developer notes app...",
                    tags: ["dev", "ideas"],
                    pinned: true,
                    updatedAt: new Date().toISOString(),
                    notebookId: null,
                    pageType: 'note',
                    layout: 'default'
                },
                {
                    id: "2",
                    title: "Deployment Config",
                    content: "Vercel settings...",
                    tags: ["devops"],
                    pinned: false,
                    updatedAt: new Date().toISOString(),
                    notebookId: "nb-2",
                    pageType: 'task',
                    layout: 'grid'
                }
            ];
            setNotes(seed);
        }

        if (savedNotebooks) {
            setNotebooks(JSON.parse(savedNotebooks));
        } else {
            setNotebooks([
                { id: "nb-1", name: "Personal", color: "blue" },
                { id: "nb-2", name: "Projects", color: "orange" }
            ]);
        }

        setIsLoading(false);
    }, []);

    // Persist helper
    const persistNotes = (updatedNotes) => {
        setNotes(updatedNotes);
        localStorage.setItem("notzeee_notes", JSON.stringify(updatedNotes));
    };

    // Persist notebooks
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem("notzeee_notebooks", JSON.stringify(notebooks));
        }
    }, [notebooks, isLoading]);

    const saveNote = (id, newTitle, newContent) => {
        const updated = notes.map((n) =>
            n.id === id
                ? { ...n, title: newTitle, content: newContent, updatedAt: new Date().toISOString() }
                : n
        );
        persistNotes(updated);
    };

    const updateNoteSettings = (id, settings) => {
        const updated = notes.map(n =>
            n.id === id ? { ...n, ...settings, updatedAt: new Date().toISOString() } : n
        );
        persistNotes(updated);
    };

    const createNote = (notebookId = null) => {
        const newNote = {
            id: Date.now().toString(),
            title: "",
            content: "",
            tags: [],
            pinned: false,
            updatedAt: new Date().toISOString(),
            notebookId: notebookId,
            pageType: 'note',
            layout: 'default'
        };
        const updated = [newNote, ...notes];
        persistNotes(updated);
        return newNote.id;
    };

    const createNotebook = (name) => {
        const newNb = {
            id: Date.now().toString(),
            name: name || "New Notebook",
            color: "neutral"
        };
        setNotebooks(prev => [...prev, newNb]);
    };

    const deleteNotebook = (id) => {
        setNotebooks(prev => prev.filter(nb => nb.id !== id));
        const updated = notes.map(n => n.notebookId === id ? { ...n, notebookId: null } : n);
        persistNotes(updated);
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
            notebooks,
            isLoading,
            saveNote,
            updateNoteSettings,
            createNote,
            createNotebook,
            deleteNotebook,
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
