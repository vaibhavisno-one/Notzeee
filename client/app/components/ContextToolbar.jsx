"use client";

import React, { useState, useEffect } from "react";
import { Bold, Italic, Highlighter, Type } from "lucide-react";

export default function ContextToolbar({
    textareaRef,
    onBoldToggle,
    onItalicToggle,
    onHighlightToggle,
    onFontChange,
    isBold,
    isItalic,
    highlightColor,
    currentFont
}) {
    const fonts = [
        { value: 'normal', label: 'Normal', className: 'font-editorial' },
        { value: 'handwritten', label: 'Handwritten', className: 'font-handwritten' },
        { value: 'monospace', label: 'Monospace', className: 'font-mono' }
    ];

    const highlightColors = [
        { value: 'yellow', label: 'Yellow', color: '#fef08a' },
        { value: 'green', label: 'Green', color: '#86efac' },
        { value: 'blue', label: 'Blue', color: '#93c5fd' },
        { value: 'pink', label: 'Pink', color: '#f9a8d4' }
    ];

    const [showFontPicker, setShowFontPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [hasSelection, setHasSelection] = useState(false);

    // Check for text selection
    useEffect(() => {
        const textarea = textareaRef?.current;
        if (!textarea) return;

        const updateSelection = () => {
            setHasSelection(textarea.selectionStart !== textarea.selectionEnd);
        };

        textarea.addEventListener('mouseup', updateSelection);
        textarea.addEventListener('keyup', updateSelection);
        textarea.addEventListener('select', updateSelection);

        return () => {
            textarea.removeEventListener('mouseup', updateSelection);
            textarea.removeEventListener('keyup', updateSelection);
            textarea.removeEventListener('select', updateSelection);
        };
    }, [textareaRef]);

    return (
        <div
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
            onMouseDown={(e) => e.preventDefault()}
        >
            {/* Font Picker */}
            {showFontPicker && (
                <div className="flex flex-col gap-1 p-2 bg-neutral-800/95 backdrop-blur shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200 min-w-[160px]">
                    {fonts.map(({ value, label, className }) => (
                        <button
                            key={value}
                            onMouseDown={() => {
                                onFontChange(value);
                                setShowFontPicker(false);
                            }}
                            className={`px-4 py-2 text-left rounded-lg transition-colors ${currentFont === value
                                    ? 'bg-indigo-500/30 text-indigo-200'
                                    : 'hover:bg-white/10 text-neutral-200'
                                } ${className}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {/* Highlight Color Picker */}
            {showHighlightPicker && hasSelection && (
                <div className="flex items-center gap-1 p-2 bg-neutral-800/95 backdrop-blur shadow-2xl rounded-full animate-in zoom-in-95 duration-200">
                    {highlightColors.map(({ value, label, color }) => (
                        <button
                            key={value}
                            onMouseDown={() => {
                                onHighlightToggle(value);
                                setShowHighlightPicker(false);
                            }}
                            className="w-8 h-8 rounded-full border-2 border-neutral-600 hover:border-neutral-400 transition-colors"
                            style={{ backgroundColor: color }}
                            title={label}
                        >
                            <span className="sr-only">{label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Main Toolbar */}
            <div className="flex items-center gap-1 p-1.5 bg-neutral-800/95 backdrop-blur shadow-2xl rounded-full text-neutral-50">
                {/* Bold */}
                <button
                    onMouseDown={onBoldToggle}
                    className={`p-2 rounded-full transition-colors ${isBold ? 'bg-indigo-500/30 text-indigo-200' : 'hover:bg-white/20'
                        }`}
                    title="Bold"
                >
                    <Bold size={16} />
                </button>

                {/* Italic */}
                <button
                    onMouseDown={onItalicToggle}
                    className={`p-2 rounded-full transition-colors ${isItalic ? 'bg-indigo-500/30 text-indigo-200' : 'hover:bg-white/20'
                        }`}
                    title="Italic"
                >
                    <Italic size={16} />
                </button>

                <div className="w-px h-4 bg-white/20 mx-1" />

                {/* Font Style */}
                <button
                    onMouseDown={() => setShowFontPicker(!showFontPicker)}
                    className={`p-2 rounded-full transition-colors ${showFontPicker ? 'bg-purple-500/30 text-purple-200' : 'hover:bg-purple-500/20 text-purple-200'
                        }`}
                    title="Font Style"
                >
                    <Type size={16} />
                </button>

                <div className="w-px h-4 bg-white/20 mx-1" />

                {/* Highlight with Color Picker */}
                <button
                    onMouseDown={() => {
                        if (hasSelection) {
                            setShowHighlightPicker(!showHighlightPicker);
                        } else {
                            onHighlightToggle(null);
                        }
                    }}
                    className={`p-2 rounded-full transition-colors ${highlightColor ? 'bg-yellow-500/30 text-yellow-200' : 'hover:bg-yellow-500/20 text-yellow-200'
                        } ${!hasSelection && !highlightColor ? 'opacity-100' : ''}`}
                    title={hasSelection ? "Highlight Selection" : "Toggle Highlight"}
                >
                    <Highlighter size={16} />
                </button>
            </div>
        </div>
    );
}
