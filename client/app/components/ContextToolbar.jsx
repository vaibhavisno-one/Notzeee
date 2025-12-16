"use client";

import { useState, useEffect } from "react";
import { Bold, Italic, Highlighter, Type } from "lucide-react";
import { FONTS, HIGHLIGHT_COLORS, hasTextSelection } from "../utils/editorUtils";

export default function ContextToolbar({
    textareaRef,
    onBoldToggle,
    onItalicToggle,
    onHighlightToggle,
    onFontChange,
    isBold,
    isItalic,
    hasHighlights,
    currentFont
}) {
    const [showFontPicker, setShowFontPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [hasSelection, setHasSelection] = useState(false);

    // Track text selection state
    useEffect(() => {
        const textarea = textareaRef?.current;
        if (!textarea) return;

        const updateSelection = () => {
            setHasSelection(hasTextSelection(textarea));
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

    const handleHighlightClick = () => {
        if (hasSelection) {
            setShowHighlightPicker(!showHighlightPicker);
        } else {
            onHighlightToggle(null);
        }
    };

    const handleColorSelect = (color) => {
        onHighlightToggle(color);
        setShowHighlightPicker(false);
    };

    return (
        <div
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
            onMouseDown={(e) => e.preventDefault()}
        >
            {/* Font Picker Dropdown */}
            {showFontPicker && (
                <FontPicker
                    fonts={FONTS}
                    currentFont={currentFont}
                    onSelect={(value) => {
                        onFontChange(value);
                        setShowFontPicker(false);
                    }}
                />
            )}

            {/* Highlight Color Picker */}
            {showHighlightPicker && hasSelection && (
                <ColorPicker
                    colors={HIGHLIGHT_COLORS}
                    onSelect={handleColorSelect}
                />
            )}

            {/* Main Toolbar */}
            <div className="flex items-center gap-1 p-1.5 bg-neutral-800/95 backdrop-blur shadow-2xl rounded-full text-neutral-50">
                <ToolbarButton
                    icon={Bold}
                    onClick={onBoldToggle}
                    isActive={isBold}
                    title="Bold"
                />

                <ToolbarButton
                    icon={Italic}
                    onClick={onItalicToggle}
                    isActive={isItalic}
                    title="Italic"
                />

                <ToolbarDivider />

                <ToolbarButton
                    icon={Type}
                    onClick={() => setShowFontPicker(!showFontPicker)}
                    isActive={showFontPicker}
                    activeColor="purple"
                    title="Font Style"
                />

                <ToolbarDivider />

                <ToolbarButton
                    icon={Highlighter}
                    onClick={handleHighlightClick}
                    isActive={hasHighlights}
                    activeColor="yellow"
                    title={hasSelection ? "Highlight Selection" : "Clear Highlights"}
                />
            </div>
        </div>
    );
}

// Sub-components for better organization

function FontPicker({ fonts, currentFont, onSelect }) {
    return (
        <div className="flex flex-col gap-1 p-2 bg-neutral-800/95 backdrop-blur shadow-2xl rounded-2xl min-w-[160px]">
            {fonts.map(({ value, label, className }) => (
                <button
                    key={value}
                    onMouseDown={() => onSelect(value)}
                    className={`px-4 py-2 text-left rounded-lg transition-colors ${currentFont === value
                            ? 'bg-indigo-500/30 text-indigo-200'
                            : 'hover:bg-white/10 text-neutral-200'
                        } ${className}`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

function ColorPicker({ colors, onSelect }) {
    return (
        <div className="flex items-center gap-1 p-2 bg-neutral-800/95 backdrop-blur shadow-2xl rounded-full">
            {colors.map(({ value, label, hex }) => (
                <button
                    key={value}
                    onMouseDown={() => onSelect(value)}
                    className="w-8 h-8 rounded-full border-2 border-neutral-600 hover:border-neutral-400 transition-colors"
                    style={{ backgroundColor: hex }}
                    title={label}
                >
                    <span className="sr-only">{label}</span>
                </button>
            ))}
        </div>
    );
}

function ToolbarButton({ icon: Icon, onClick, isActive, activeColor = 'indigo', title }) {
    const activeColors = {
        indigo: 'bg-indigo-500/30 text-indigo-200',
        purple: 'bg-purple-500/30 text-purple-200',
        yellow: 'bg-yellow-500/30 text-yellow-200'
    };

    const hoverColors = {
        indigo: 'hover:bg-white/20',
        purple: 'hover:bg-purple-500/20 text-purple-200',
        yellow: 'hover:bg-yellow-500/20 text-yellow-200'
    };

    return (
        <button
            onMouseDown={onClick}
            className={`p-2 rounded-full transition-colors ${isActive ? activeColors[activeColor] : hoverColors[activeColor]
                }`}
            title={title}
        >
            <Icon size={16} />
        </button>
    );
}

function ToolbarDivider() {
    return <div className="w-px h-4 bg-white/20 mx-1" />;
}
