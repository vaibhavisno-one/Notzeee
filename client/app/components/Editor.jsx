"use client";

import { useState, useEffect, useRef } from "react";
import { useNotes } from "../context/NotesContext";
import MetadataPanel from "./MetadataPanel";
import ContextToolbar from "./ContextToolbar";
import FormattedPreview from "./FormattedPreview";

export default function Editor({ noteId }) {
    const { notes, saveNote, updateNoteSettings, isLoading, showMetadata, isFocusMode } = useNotes();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isInitializing, setIsInitializing] = useState(true);

    // Formatting states
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [highlightRanges, setHighlightRanges] = useState([]); // Array of { start, end, color }
    const [currentFont, setCurrentFont] = useState('normal');

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

    const handleHighlightToggle = (color) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (color && start !== end) {
            // Add new highlight range for selected text
            const newRange = { start, end, color };
            setHighlightRanges(prev => [...prev, newRange]);
        } else if (!color) {
            // Clear all highlights
            setHighlightRanges([]);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col h-full bg-neutral-800 animate-pulse">
                <div className="max-w-5xl w-full mx-auto px-16 py-12 flex flex-col gap-6">
                    <div className="h-10 bg-neutral-700 rounded w-1/2" />
                    <div className="h-96 bg-neutral-700 rounded w-full" />
                </div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="flex-1 flex items-center justify-center text-neutral-500">
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
            case 'idea': return classes + "bg-amber-950/20";
            case 'task': return classes + "bg-blue-950/20";
            case 'journal': return classes + "bg-stone-950/20";
            default: return classes + "bg-neutral-800";
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
                backgroundImage: 'linear-gradient(transparent calc(100% - 1px), var(--ruled-line-color) calc(100% - 1px))',
                backgroundSize: `100% ${LINE_HEIGHT}`,
                backgroundPosition: '0 8px'
            };
        }
        if (note.layout === 'grid') {
            return {
                ...baseStyle,
                backgroundImage: 'radial-gradient(var(--ruled-line-color) 1px, transparent 1px)',
                backgroundSize: '1.5rem 1.5rem'
            };
        }
        if (note.layout === 'dotted') {
            return {
                ...baseStyle,
                backgroundImage: 'radial-gradient(var(--ruled-line-color) 1.5px, transparent 1.5px)',
                backgroundSize: '2rem 2rem'
            };
        }
        return baseStyle;
    };

    // Get dynamic textarea classes based on formatting state
    const getTextareaClasses = () => {
        let classes = "relative flex-1 w-full resize-none bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder:text-neutral-400 transition-all duration-300 text-lg min-h-[800px] ";

        // Font style
        if (currentFont === 'handwritten') {
            classes += "font-handwritten ";
        } else if (currentFont === 'monospace') {
            classes += "font-mono ";
        } else {
            classes += "font-editorial ";
        }

        // Bold
        if (isBold) {
            classes += "font-bold ";
        }

        // Italic
        if (isItalic) {
            classes += "italic ";
        }

        return classes;
    };

    const getTextareaStyles = () => {
        return {
            ...getLayoutStyles(),
            '--ruled-line-color': document.documentElement.classList.contains('dark') ? '#404040' : '#696666ff',
            color: 'transparent', // Hide text - preview overlay shows it
            caretColor: '#fafafa', // Keep caret visible
        };
    };

    return (
        <div className={`flex-1 flex flex-col h-full relative ${getPageClasses()}`}>

            {/* Metadata Panel */}
            {showMetadata && <MetadataPanel note={note} />}

            <div
                className={`w-full mx-auto px-8 py-12 md:px-16 lg:px-24 flex flex-col gap-8 transition-all duration-500 h-full max-w-6xl`}
            >

                {/* Title Input */}
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Untitled Note"
                    className={`text-4xl font-editorial font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 transition-all duration-500 placeholder:text-neutral-400 focus:placeholder:text-indigo-200 ${isFocusMode ? "text-neutral-200 text-center" : "text-neutral-50"}`}
                    style={{ '--ruled-line-color': 'var(--color-neutral-300)' }}
                />

                {/* Editor Body with Preview Overlay */}
                <div className="relative flex-1 w-full">
                    {/* Formatted Preview Layer - shows all visual formatting */}
                    <FormattedPreview
                        content={content}
                        textareaRef={textareaRef}
                        highlightRanges={highlightRanges}
                        isBold={isBold}
                        isItalic={isItalic}
                        currentFont={currentFont}
                    />

                    {/* Textarea Layer - handles input only, text is transparent */}
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Start writing..."
                        spellCheck={false}
                        style={getTextareaStyles()}
                        className={getTextareaClasses()}
                    />
                </div>

                {/* Contextual Toolbar */}
                <ContextToolbar
                    textareaRef={textareaRef}
                    onBoldToggle={() => setIsBold(!isBold)}
                    onItalicToggle={() => setIsItalic(!isItalic)}
                    onHighlightToggle={handleHighlightToggle}
                    onFontChange={setCurrentFont}
                    isBold={isBold}
                    isItalic={isItalic}
                    highlightColor={highlightRanges.length > 0 ? 'active' : null}
                    currentFont={currentFont}
                />

                {/* Empty State Helper */}
                {!content && !title && (
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-500 ${isFocusMode ? "opacity-0" : "opacity-40"}`}>
                        <div className="text-center space-y-2">
                            <p className="font-editorial text-xl italic text-neutral-500">"The page is yours. Start writing."</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
