"use client";

import { useNotes } from "../context/NotesContext";
import { Clock, CheckCircle, Search, X, PanelLeftClose, PanelLeftOpen, Info, Pin } from "lucide-react";

export default function Topbar({ noteId }) {
    const { notes, isLoading, searchQuery, setSearchQuery, isFocusMode, setIsFocusMode, showMetadata, setShowMetadata, togglePin } = useNotes();
    const note = notes.find(n => n.id === noteId);

    // Simple relative time formatter
    const timeAgo = (dateStr) => {
        if (!dateStr) return "Just now";
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
    };

    if (isLoading) return <header className="h-12 border-b border-neutral-200 bg-white" />;

    return (
        <header className="h-12 border-b border-neutral-200 flex items-center justify-between px-4 bg-white shrink-0 transition-all duration-300">
            {/* Left: Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono min-w-[150px]">
                {!isFocusMode && (
                    <>
                        <span className="hover:text-neutral-600 cursor-pointer transition-colors">/notes</span>
                        <span>/</span>
                    </>
                )}
                <span className="text-neutral-600 font-medium truncate max-w-[200px]">
                    {note ? (note.title || "Untitled") : "Select a note"}
                </span>
            </div>

            {/* Center: Search (Visible only if not in focus mode, or maybe always? "Inline search in top bar". If sidebar is hidden, search feels weird if it filters sidebar. But maybe search unhides sidebar? For now, let's show it always, but meaningfulness is debatable in focus mode. Let's hide in Focus Mode for cleaner reading.) */}
            {!isFocusMode && (
                <div className="flex-1 max-w-md mx-4 relative group">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-600 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes..."
                        className="w-full pl-9 pr-8 py-1.5 bg-neutral-100/50 border border-transparent rounded-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-200 focus:shadow-sm transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-200 rounded-full text-neutral-400 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            )}

            {/* Right: Actions & Status */}
            <div className="flex items-center gap-4 text-xs font-utility">
                {/* Actions */}
                <div className="flex items-center gap-1 border-r border-neutral-200 pr-4 mr-0">
                    <button
                        onClick={() => setShowMetadata(!showMetadata)}
                        className={`p-1.5 rounded-md transition-colors ${showMetadata ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"}`}
                        title="Toggle Metadata"
                    >
                        <Info size={16} />
                    </button>
                    <button
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className={`p-1.5 rounded-md transition-colors ${isFocusMode ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"}`}
                        title="Toggle Focus Mode"
                    >
                        {isFocusMode ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                    </button>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 text-neutral-400">
                    <span className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-neutral-400" />
                        <span className="hidden sm:inline">Saved</span>
                    </span>
                    {note && (
                        <span className="flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>{timeAgo(note.updatedAt)}</span>
                        </span>
                    )}
                </div>
            </div>
        </header>
    );
}
