"use client";

import { useState, useEffect, useRef } from "react";
import { useNotes } from "../context/NotesContext";
import MetadataPanel from "./MetadataPanel";
import ContextToolbar from "./ContextToolbar";
import FormattedPreview from "./FormattedPreview";
import { LINE_HEIGHT, TEXTAREA_MIN_HEIGHT, getFontClassName, getSelectionRange } from "../utils/editorUtils";

export default function Editor({ noteId }) {
    const { notes, saveNote, isLoading, showMetadata, isFocusMode } = useNotes();
    const textareaRef = useRef(null);

    // Note content state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // Formatting state
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [currentFont, setCurrentFont] = useState('normal');
    const [highlightRanges, setHighlightRanges] = useState([]);

    const note = notes.find((n) => n.id === noteId);

    // Load note content
    useEffect(() => {
        if (isLoading || !note) return;
        setTitle(note.title);
        setContent(note.content);
    }, [noteId, isLoading, note]);

    // Event handlers
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
        if (!color) {
            setHighlightRanges([]);
            return;
        }

        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start !== end) {
            const highlightedText = content.substring(start, end);
            setHighlightRanges(prev => [...prev, {
                start,
                end,
                color,
                text: highlightedText // Store the actual text
            }]);
        }
    };

    // Loading state
    if (isLoading) {
        return <LoadingState />;
    }

    // Not found state
    if (!note) {
        return <NotFoundState />;
    }

    return (
        <div className={`flex-1 flex flex-col h-full relative ${getPageBackgroundClass(note.pageType)}`}>
            {showMetadata && <MetadataPanel note={note} />}

            <div className="w-full mx-auto px-8 py-12 md:px-16 lg:px-24 flex flex-col gap-8 h-full max-w-6xl">
                {/* Title */}
                <TitleInput
                    value={title}
                    onChange={handleTitleChange}
                    isFocusMode={isFocusMode}
                />

                {/* Editor Area */}
                <div className="relative flex-1 w-full">
                    <FormattedPreview
                        content={content}
                        textareaRef={textareaRef}
                        highlightRanges={highlightRanges}
                        isBold={isBold}
                        isItalic={isItalic}
                        currentFont={currentFont}
                    />

                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Start writing..."
                        spellCheck={false}
                        style={getTextareaStyles(note.layout)}
                        className={getTextareaClasses(currentFont, isBold, isItalic)}
                    />
                </div>

                {/* Toolbar */}
                <ContextToolbar
                    textareaRef={textareaRef}
                    onBoldToggle={() => setIsBold(!isBold)}
                    onItalicToggle={() => setIsItalic(!isItalic)}
                    onHighlightToggle={handleHighlightToggle}
                    onFontChange={setCurrentFont}
                    isBold={isBold}
                    isItalic={isItalic}
                    hasHighlights={highlightRanges.length > 0}
                    currentFont={currentFont}
                />

                {/* Empty state */}
                {!content && !title && <EmptyState isFocusMode={isFocusMode} />}
            </div>
        </div>
    );
}

// Sub-components

function TitleInput({ value, onChange, isFocusMode }) {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Untitled Note"
            className={`text-4xl font-editorial font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 transition-all duration-500 placeholder:text-neutral-400 focus:placeholder:text-indigo-200 ${isFocusMode ? "text-neutral-200 text-center" : "text-neutral-50"
                }`}
        />
    );
}

function EmptyState({ isFocusMode }) {
    return (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-500 ${isFocusMode ? "opacity-0" : "opacity-40"
            }`}>
            <p className="font-editorial text-xl italic text-neutral-500 text-center">
                "The page is yours. Start writing."
            </p>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex-1 flex flex-col h-full bg-neutral-800 animate-pulse">
            <div className="max-w-5xl w-full mx-auto px-16 py-12 flex flex-col gap-6">
                <div className="h-10 bg-neutral-700 rounded w-1/2" />
                <div className="h-96 bg-neutral-700 rounded w-full" />
            </div>
        </div>
    );
}

function NotFoundState() {
    return (
        <div className="flex-1 flex items-center justify-center text-neutral-500">
            <p>Note not found.</p>
        </div>
    );
}

// Helper functions

function getPageBackgroundClass(pageType) {
    const baseClass = "transition-colors duration-500";
    const typeClasses = {
        'idea': 'bg-amber-950/20',
        'task': 'bg-blue-950/20',
        'journal': 'bg-stone-950/20'
    };
    return `${baseClass} ${typeClasses[pageType] || 'bg-neutral-800'}`;
}

function getLayoutStyles(layout) {
    const baseStyle = {
        lineHeight: LINE_HEIGHT,
        backgroundAttachment: 'local',
        color: 'transparent',
        caretColor: '#fafafa',
        '--ruled-line-color': '#404040'
    };

    const layoutStyles = {
        'ruled': {
            backgroundImage: 'linear-gradient(transparent calc(100% - 1px), var(--ruled-line-color) calc(100% - 1px))',
            backgroundSize: `100% ${LINE_HEIGHT}`,
            backgroundPosition: '0 8px'
        },
        'grid': {
            backgroundImage: 'radial-gradient(var(--ruled-line-color) 1px, transparent 1px)',
            backgroundSize: '1.5rem 1.5rem'
        },
        'dotted': {
            backgroundImage: 'radial-gradient(var(--ruled-line-color) 1.5px, transparent 1.5px)',
            backgroundSize: '2rem 2rem'
        }
    };

    return { ...baseStyle, ...layoutStyles[layout] };
}

function getTextareaClasses(font, isBold, isItalic) {
    return [
        'relative flex-1 w-full resize-none bg-transparent border-none',
        'focus:outline-none focus:ring-0 p-0',
        'placeholder:text-neutral-400 transition-all duration-300',
        `text-lg min-h-[${TEXTAREA_MIN_HEIGHT}]`,
        getFontClassName(font),
        isBold && 'font-bold',
        isItalic && 'italic'
    ].filter(Boolean).join(' ');
}

function getTextareaStyles(layout) {
    return getLayoutStyles(layout);
}
