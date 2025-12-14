"use client";

import { useState, useEffect } from "react";
import { useNotes } from "../context/NotesContext";
import MetadataPanel from "./MetadataPanel";

export default function Editor({ noteId }) {
    const { notes, saveNote, isLoading, showMetadata, isFocusMode } = useNotes();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isInitializing, setIsInitializing] = useState(true);

    const note = notes.find((n) => n.id === noteId);

    useEffect(() => {
        if (isLoading) return;

        if (note) {
            // Only update local state from context if we are initializing or switching notes
            // Avoid overwriting local edits with context (though context updates on every change here so it's circular)
            // Simplest for this architecture: Sync on noteId change.
            setTitle(note.title);
            setContent(note.content);
            setIsInitializing(false);
        }
    }, [noteId, isLoading, note]); // Depend on note but careful about infinite loops if we added note directly alone. Dependencies should be correct.

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        saveNote(noteId, newTitle, content);
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
        saveNote(noteId, title, newContent);
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col h-full bg-white animate-pulse">
                <div className="max-w-3xl w-full mx-auto px-16 py-12 flex flex-col gap-6">
                    <div className="h-10 bg-neutral-100 rounded w-1/2" />
                    <div className="h-96 bg-neutral-100 rounded w-full" />
                </div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="flex-1 flex items-center justify-center text-neutral-400">
                <p>Note not found.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white relative scroll-smooth">

            {/* Metadata Panel (Collapsible) */}
            {showMetadata && <MetadataPanel note={note} />}

            <div className={`w-full mx-auto px-8 py-12 md:px-12 lg:px-16 flex flex-col gap-8 transition-all duration-500 ${isFocusMode ? "max-w-2xl" : "max-w-3xl"}`}>

                {/* Title Input */}
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Untitled Note"
                    className={`text-4xl font-editorial font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 transition-all duration-500 placeholder:text-neutral-200 focus:placeholder:text-indigo-200 ${isFocusMode ? "text-neutral-700 text-center" : "text-neutral-900"}`}
                />

                {/* Editor Body */}
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Start writing..."
                    spellCheck={false}
                    className={`w-full h-[calc(100vh-300px)] resize-none font-editorial bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder:text-neutral-200 transition-all duration-500 ${isFocusMode ? "text-xl leading-loose text-neutral-700" : "text-lg leading-relaxed text-neutral-800"}`}
                />

                {/* Empty State Helper (Only if truly empty) */}
                {!content && !title && (
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-500 ${isFocusMode ? "opacity-0" : "opacity-40"}`}>
                        <div className="text-center space-y-2">
                            <p className="font-editorial text-xl italic text-neutral-300">"The page is yours. Start writing."</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
