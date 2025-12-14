"use client";

import { useState, useEffect, useRef } from "react";
import { useNotes } from "../context/NotesContext";
import MetadataPanel from "./MetadataPanel";
import ContextToolbar from "./ContextToolbar";

export default function Editor({ noteId }) {
    const { notes, saveNote, updateNoteSettings, isLoading, showMetadata, isFocusMode } = useNotes();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isInitializing, setIsInitializing] = useState(true);
    const [toolbarVisible, setToolbarVisible] = useState(false);
    const textareaRef = useRef(null);

    const note = notes.find((n) => n.id === noteId);

    useEffect(() => {
        if (isLoading) return;

        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setIsInitializing(false);
        }
    }, [noteId, isLoading, note]);

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

    // Wrapper for Toolbar to update content
    const handleToolbarUpdate = (newContent) => {
        setContent(newContent);
        saveNote(noteId, title, newContent);
        setToolbarVisible(false); // Close toolbar on action
    };

    const handleSelectionChange = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        // Show if selection exists
        if (textarea.selectionStart !== textarea.selectionEnd) {
            setToolbarVisible(true);
        } else {
            setToolbarVisible(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col h-full bg-white animate-pulse">
                <div className="max-w-5xl w-full mx-auto px-16 py-12 flex flex-col gap-6">
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

    // Page Styles Logic
    const LINE_HEIGHT = "2.5rem"; // 40px

    const getPageClasses = () => {
        let classes = "transition-colors duration-500 ";
        // Page Type Tints
        switch (note.pageType) {
            case 'idea': return classes + "bg-amber-50/40";
            case 'task': return classes + "bg-blue-50/30";
            case 'journal': return classes + "bg-stone-50/40";
            default: return classes + "bg-white";
        }
    };

    const getLayoutStyles = () => {
        const baseStyle = {
            lineHeight: LINE_HEIGHT,
            backgroundAttachment: 'local'
        };

        if (note.layout === 'ruled') {
            return {
                ...baseStyle,
                backgroundImage: 'linear-gradient(transparent calc(100% - 1px), #696666ff calc(100% - 1px))',
                backgroundSize: `100% ${LINE_HEIGHT}`,
                backgroundPosition: '0 8px'
            };
        }
        if (note.layout === 'grid') {
            return {
                ...baseStyle,
                backgroundImage: 'radial-gradient(#696666ff 1px, transparent 1px)',
                backgroundSize: '1.5rem 1.5rem'
            };
        }
        if (note.layout === 'dotted') {
            return {
                ...baseStyle,
                backgroundImage: 'radial-gradient(#696666ff 1.5px, transparent 1.5px)',
                backgroundSize: '2rem 2rem'
            };
        }
        return baseStyle;
    };

    return (
        <div className={`flex-1 flex flex-col h-full relative ${getPageClasses()}`}>

            {/* Metadata Panel */}
            {showMetadata && <MetadataPanel note={note} />}

            <div
                className={`w-full mx-auto px-8 py-12 md:px-12 lg:px-16 flex flex-col gap-8 transition-all duration-500 h-full ${isFocusMode ? "max-w-6xl" : "max-w-4xl"}`}
            >

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
                    ref={textareaRef}
                    value={content}
                    onChange={handleContentChange}
                    onSelect={handleSelectionChange}
                    onKeyUp={handleSelectionChange}
                    onMouseUp={handleSelectionChange}
                    placeholder="Start writing..."
                    spellCheck={false}
                    style={getLayoutStyles()}
                    className={`flex-1 w-full resize-none font-editorial bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder:text-neutral-200 transition-all duration-500 text-lg text-neutral-800`}
                />

                {/* Contextual Toolbar */}
                <ContextToolbar
                    textareaRef={textareaRef}
                    content={content}
                    setContent={handleToolbarUpdate}
                    isVisible={toolbarVisible}
                    onClose={() => setToolbarVisible(false)}
                />

                {/* Empty State Helper */}
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
