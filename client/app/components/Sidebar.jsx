"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Archive, User, Pin, Tag } from "lucide-react";
import { useNotes } from "../context/NotesContext";

export default function Sidebar() {
    const { notes, createNote, isLoading, isFocusMode, searchQuery } = useNotes();
    const pathname = usePathname();
    const router = useRouter();

    if (isFocusMode) return null;

    const handleCreate = () => {
        const newId = createNote();
        router.push(`/app/note/${newId}`);
    };

    if (isLoading) return <aside className="w-[260px] h-full bg-neutral-50 border-r border-neutral-200" />;

    // Filter notes based on search query
    const filteredNotes = notes.filter(n => {
        const q = searchQuery.toLowerCase();
        return (
            (n.title && n.title.toLowerCase().includes(q)) ||
            (n.content && n.content.toLowerCase().includes(q)) ||
            (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))
        );
    });

    const pinnedNotes = filteredNotes.filter(n => n.pinned);
    const recentNotes = filteredNotes.filter(n => !n.pinned).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const NoteItem = ({ note }) => {
        const isActive = pathname === `/app/note/${note.id}`;
        return (
            <Link
                href={`/app/note/${note.id}`}
                className={`group flex flex-col gap-1 px-3 py-2 rounded-md transition-all ${isActive
                    ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200"
                    : "text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900"
                    }`}
            >
                <div className="flex items-center justify-between gap-2">
                    <span className={`font-medium truncate text-sm ${!note.title && "text-neutral-400 italic"}`}>
                        {note.title || "Untitled Note"}
                    </span>
                    {note.pinned && <Pin size={10} className="text-neutral-400 shrink-0 fill-neutral-400/20" />}
                </div>

                {/* Visual Tags */}
                {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                        {note.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-500 font-medium group-hover:bg-neutral-200/80 transition-colors">
                                <span className="mr-0.5 opacity-50">#</span>{tag}
                            </span>
                        ))}
                        {note.tags.length > 3 && (
                            <span className="text-[10px] text-neutral-400">+{note.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </Link>
        );
    };

    return (
        <aside className="w-[260px] h-full flex flex-col border-r border-neutral-200 bg-neutral-50 text-neutral-900 font-utility text-sm shrink-0 transition-all duration-300">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200/50 flex flex-col gap-4">
                <div className="flex items-center gap-2 px-1 text-neutral-500">
                    <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center">
                        <User size={12} className="text-neutral-600" />
                    </div>
                    <span className="font-medium text-xs tracking-tight">Vaibhav's Notes</span>
                </div>
                <button
                    onClick={handleCreate}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-neutral-200 shadow-sm px-3 py-1.5 rounded-md text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 transition-all font-medium text-xs"
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
                        <p className="text-xs text-neutral-400">
                            {searchQuery ? "No matching notes." : "No notes yet."}
                        </p>
                    </div>
                )}

                {/* Pinned Section */}
                {pinnedNotes.length > 0 && (
                    <section>
                        <h3 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Pinned</h3>
                        <div className="space-y-0.5">
                            {pinnedNotes.map(n => <NoteItem key={n.id} note={n} />)}
                        </div>
                    </section>
                )}

                {/* Recent Section */}
                {recentNotes.length > 0 && (
                    <section>
                        <h3 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Recent</h3>
                        <div className="space-y-0.5">
                            {recentNotes.map(n => <NoteItem key={n.id} note={n} />)}
                        </div>
                    </section>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-neutral-200/50">
                <Link href="/app/archive" className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 px-2 py-1.5 transition-colors rounded-md hover:bg-neutral-200/50">
                    <Archive size={14} />
                    <span className="text-xs font-medium">Archive</span>
                </Link>
            </div>
        </aside>
    );
}
