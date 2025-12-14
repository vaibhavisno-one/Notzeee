"use client";

import { Bold, Italic, Code, Heading1, Heading2, Quote, Minus, Highlighter, Palette } from "lucide-react";

export default function ContextToolbar({ textareaRef, content, setContent, isVisible, onClose }) {

    const insertFormat = (prefix, suffix = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);

        setContent(newText);
        // Keep toolbar open or close? User prefers "Disappears on blur".
        // Let's keep it open to allow multiple edits, OR close.
        // If we want to allow Bold + Italic, we should keep it open.
        // But onSelect in Editor might re-trigger if selection persists.
        // Let's rely on Editor's onSelect to show it again if needed.
        // For now, doing nothing with onClose here allows it to stay if selection remains?
        // Actually, setContent updates value, which might shift selection to end of inserted text in some browsers, or keep it.
        // If selection is lost, Editor hides it.
        // Let's just focus the textarea again to be safe?
        textarea.focus();
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1.5 bg-neutral-900/95 backdrop-blur shadow-2xl rounded-full text-white animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
            onMouseDown={(e) => e.preventDefault()} // Prevent toolbar click from blurring editor
        >
            <button onMouseDown={() => insertFormat("**", "**")} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Bold">
                <Bold size={16} />
            </button>
            <button onMouseDown={() => insertFormat("*", "*")} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Italic">
                <Italic size={16} />
            </button>
            <button onMouseDown={() => insertFormat("`", "`")} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Code">
                <Code size={16} />
            </button>

            <div className="w-px h-4 bg-white/20 mx-1" />

            <button onMouseDown={() => insertFormat("==", "==")} className="p-2 hover:bg-yellow-500/20 text-yellow-200 rounded-full transition-colors" title="Highlight">
                <Highlighter size={16} />
            </button>
            <button onMouseDown={() => insertFormat('<span style="color:#ef4444">', '</span>')} className="p-2 hover:bg-red-500/20 text-red-300 rounded-full transition-colors" title="Red Text">
                <Palette size={16} />
            </button>

            <div className="w-px h-4 bg-white/20 mx-1" />

            <button onMouseDown={() => insertFormat("\n# ")} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Heading 1">
                <Heading1 size={16} />
            </button>
            <button onMouseDown={() => insertFormat("\n> ")} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Quote">
                <Quote size={16} />
            </button>
        </div>
    );
}
