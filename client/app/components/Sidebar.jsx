"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Archive, User, Pin, Folder, ChevronDown, ChevronRight } from "lucide-react";
import { useNotes } from "../context/NotesContext";

export default function Sidebar() {
    const { notes, notebooks, createNote, isLoading, isFocusMode, searchQuery } = useNotes();
    const pathname = usePathname();
    const router = useRouter();
    const [expandedNotebooks, setExpandedNotebooks] = useState({});

    if (isFocusMode) return null;

    const handleCreate = () => {
        const newId = createNote();
        router.push(`/app/note/${newId}`);
    };

    const toggleNotebook = (id) => {
        setExpandedNotebooks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (isLoading) return <aside className="w-[260px] h-full bg-neutral-800 border-r border-neutral-600" />;

    // Filter notes based on search query
    const filteredNotes = notes.filter(n => {
        const q = searchQuery.toLowerCase();
        return (
            (n.title && n.title.toLowerCase().includes(q)) ||
            (n.content && n.content.toLowerCase().includes(q)) ||
            (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))
        );
    });

    // Grouping Logic
    const pinnedNotes = filteredNotes.filter(n => n.pinned);
    // If not searching, we group by notebook. If searching, we flatten?
    // Let's keep notebook structure if not searching.
    const isSearching = searchQuery.length > 0;

    // Notes that are NOT pinned and NOT in a notebook (or if searching, just all matches)
    // Actually, "Recent" usually implies flat list.
    // Let's follow plan: Pinned -> Notebooks -> Uncategorized.
    const uncategorizedNotes = filteredNotes.filter(n => !n.pinned && !n.notebookId).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const NoteItem = ({ note }) => {
        const isActive = pathname === `/app/note/${note.id}`;
        return (
            <Link
                href={`/app/note/${note.id}`}
                className={`group flex flex-col gap-1 px-3 py-2 rounded-md transition-all ${isActive
                    ? "bg-neutral-700 text-neutral-50 shadow-sm ring-1 ring-neutral-600"
                    : "text-neutral-300 hover:bg-neutral-700/50 hover:text-neutral-50"
                    }`}
            >
                <div className="flex items-center justify-between gap-2">
                    <span className={`font-medium truncate text-sm ${!note.title && "text-neutral-500 italic"}`}>
                        {note.title || "Untitled Note"}
                    </span>
                    {note.pinned && <Pin size={10} className="text-neutral-500 shrink-0 fill-neutral-500/20" />}
                </div>

                {/* Visual Tags */}
                {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                        {note.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-neutral-700 text-neutral-300 font-medium group-hover:bg-neutral-600/80 transition-colors">
                                <span className="mr-0.5 opacity-50">#</span>{tag}
                            </span>
                        ))}
                        {note.tags.length > 3 && (
                            <span className="text-[10px] text-neutral-500">+{note.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </Link>
        );
    };

    const NotebookItem = ({ notebook }) => {
        const nbNotes = filteredNotes.filter(n => !n.pinned && n.notebookId === notebook.id).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        if (nbNotes.length === 0 && isSearching) return null; // Hide empty if searching

        const isExpanded = expandedNotebooks[notebook.id] !== false; // Default Open

        return (
            <div className="flex flex-col gap-0.5">
                <button
                    onClick={() => toggleNotebook(notebook.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-neutral-300 hover:text-neutral-50 group transition-colors select-none"
                >
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <Folder size={12} className={`text-${notebook.color}-500 fill-${notebook.color}-500/10`} />
                    <span className="text-xs font-medium uppercase tracking-wide truncate flex-1 text-left">{notebook.name}</span>
                    <span className="text-[10px] text-neutral-500">{nbNotes.length}</span>
                </button>

                {isExpanded && (
                    <div className="pl-3 border-l border-neutral-600/50 ml-4 space-y-0.5">
                        {nbNotes.length > 0 ? (
                            nbNotes.map(n => <NoteItem key={n.id} note={n} />)
                        ) : (
                            <p className="px-3 py-1.5 text-[10px] text-neutral-500 italic pl-2">Empty</p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside className="w-[260px] h-full flex flex-col border-r border-neutral-600 bg-neutral-800 text-neutral-50 font-utility text-sm shrink-0 transition-all duration-300">
            {/* Header */}
            <div className="p-4 border-b border-neutral-600/50 flex flex-col gap-4">
                <div className="flex items-center gap-2 px-1 text-neutral-300">
                    <div className="w-5 h-5 rounded-full bg-neutral-600 flex items-center justify-center">
                        <User size={12} className="text-neutral-300 text-neutral-300" />
                    </div>
                    <span className="font-medium text-xs tracking-tight">Vaibhav's Notes</span>
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

                {/* Pinned Section */}
                {pinnedNotes.length > 0 && (
                    <section>
                        <h3 className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Pinned</h3>
                        <div className="space-y-0.5">
                            {pinnedNotes.map(n => <NoteItem key={n.id} note={n} />)}
                        </div>
                    </section>
                )}

                {/* Notebooks Section */}
                {!isSearching && (
                    <section className="space-y-1">
                        <div className="flex items-center justify-between px-3 mb-1">
                            <h3 className="text-[10px] font-bold text-neutral-400 text-neutral-500 uppercase tracking-widest">Notebooks</h3>
                            <button
                                onClick={() => createNotebook(prompt("Notebook Name:") || "New Notebook")}
                                className="text-neutral-500 hover:text-neutral-50 transition-colors"
                                title="New Notebook"
                            >
                                <Plus size={10} />
                            </button>
                        </div>
                        {notebooks.map(nb => <NotebookItem key={nb.id} notebook={nb} />)}
                    </section>
                )}

                {/* Recent / Uncategorized Section */}
                {uncategorizedNotes.length > 0 && (
                    <section>
                        <h3 className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Recent</h3>
                        <div className="space-y-0.5">
                            {uncategorizedNotes.map(n => <NoteItem key={n.id} note={n} />)}
                        </div>
                    </section>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-neutral-600/50">
                <Link href="/app/archive" className="flex items-center gap-2 text-neutral-300 hover:text-neutral-50 px-2 py-1.5 transition-colors rounded-md hover:bg-neutral-700/50">
                    <Archive size={14} />
                    <span className="text-xs font-medium">Archive</span>
                </Link>
            </div>
        </aside>
    );
}
