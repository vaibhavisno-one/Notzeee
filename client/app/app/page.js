"use client";
import { Loader2 } from "lucide-react";
import { useNotes } from "../context/NotesContext";

export default function AppPage() {
    // We can use NotesContext to show something if we want, or just static text.
    // The sidebar handles navigation. This area is empty until a note is selected.
    const { isLoading } = useNotes();

    return (
        <div className="flex flex-col h-screen bg-neutral-900">
            {/* Header */}
            <header className="border-b border-neutral-600 px-6 py-4 flex items-center justify-between bg-neutral-800">
                <h1 className="text-xl font-bold font-editorial text-neutral-50">Notzeee</h1>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-neutral-400 bg-neutral-700/50 px-2 py-1 rounded">LOCAL MODE</span>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                <div className="flex flex-col h-full flex-1 items-center justify-center text-neutral-500">
                    <p className="text-sm">Select a note from the sidebar to view</p>
                </div>
            </div>
        </div>
    );
}
