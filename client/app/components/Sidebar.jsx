"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, User, Pin } from "lucide-react";
import { useNotes } from "../context/NotesContext";

export default function Sidebar() {
    const { notes, createNote, isLoading, isFocusMode, searchQuery } = useNotes();
    const pathname = usePathname();
    const router = useRouter();

    if (isFocusMode) return null;

    const handleCreate = async () => {
        const newId = await createNote();
        if (newId) {
            router.push(`/app/note/${newId}`);
        }
    };

    if (isLoading) return <aside className="w-[260px] h-full bg-neutral-800 border-r border-neutral-600" />;

    // Filter notes based on search query
    const filteredNotes = notes.filter(n => {
        const q = searchQuery.toLowerCase();
        return (
            (n.title && n.title.toLowerCase().includes(q)) ||
            (n.content && n.content.toLowerCase().includes(q))
        );
    });

    // Separate owned and shared notes
    const ownedNotes = filteredNotes.filter(n => !n.collaborators || n.collaborators.length === 0);
    const sharedNotes = filteredNotes.filter(n => n.collaborators && n.collaborators.length > 0);

    const NoteItem = ({ note }) => {
        const isActive = pathname === `/app/note/${note._id}`;
        return (
            <Link
                href={`/app/note/${note._id}`}
                className={`group flex flex-col gap-1 px-3 py-2 rounded-md transition-all ${isActive
                    ? "bg-neutral-700 text-neutral-50 shadow-sm ring-1 ring-neutral-600"
                    : "text-neutral-300 hover:bg-neutral-700/50 hover:text-neutral-50"
                    }`}
            >
                <div className="flex items-center justify-between gap-2">
                    <span className={`font-medium truncate text-sm ${!note.title && "text-neutral-500 italic"}`}>
                        {note.title || "Untitled Note"}
                    </span>
                </div>
            </Link>
        );
    };

    return (
        <aside className="w-[260px] h-full flex flex-col border-r border-neutral-600 bg-neutral-800 text-neutral-50 font-utility text-sm shrink-0 transition-all duration-300">
            {/* Header */}
            <div className="p-4 border-b border-neutral-600/50 flex flex-col gap-4">
                <div className="flex items-center gap-2 px-1 text-neutral-300">
                    <div className="w-5 h-5 rounded-full bg-neutral-600 flex items-center justify-center">
                        <User size={12} className="text-neutral-300" />
                    </div>
                    <span className="font-medium text-xs tracking-tight">My Notes</span>
                </div>
                <button
                    onClick={handleCreate}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-700 border border-neutral-600 shadow-sm px-3 py-1.5 rounded-md text-neutral-50 hover:bg-neutral-600 hover:border-neutral-400 transition-all font-medium text-xs"
                >
                    <Plus size={14} />
                    New Note
                </button>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto py-2 px-2 space-y-6">

                {/* Empty State / No Results */}
                {filteredNotes.length === 0 && (
                    <div className="px-4 py-8 text-center">
                        <p className="text-xs text-neutral-500">
                            {searchQuery ? "No matching notes." : "No notes yet."}
                        </p>
                    </div>
                )}

                {/* My Notes Section */}
                {ownedNotes.length > 0 && (
                    <section>
                        <h3 className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">My Notes</h3>
                        <div className="space-y-0.5">
                            {ownedNotes.map(n => <NoteItem key={n._id} note={n} />)}
                        </div>
                    </section>
                )}

                {/* Shared Notes Section */}
                {sharedNotes.length > 0 && (
                    <section>
                        <h3 className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Shared with Me</h3>
                        <div className="space-y-0.5">
                            {sharedNotes.map(n => <NoteItem key={n._id} note={n} />)}
                        </div>
                    </section>
                )}
            </div>
        </aside>
    );
}
