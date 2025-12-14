"use client";

import { useState } from "react";
import { useNotes } from "../context/NotesContext";
import { Calendar, Tag, Type, Clock, X } from "lucide-react";

export default function MetadataPanel({ note }) {
    const { addTag, removeTag } = useNotes();
    const [tagInput, setTagInput] = useState("");

    if (!note) return null;

    const wordCount = note.content ? note.content.trim().split(/\s+/).length : 0;
    const readingTime = Math.ceil(wordCount / 200); // 200 wpm

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (tagInput.trim()) {
                addTag(note.id, tagInput.trim());
                setTagInput("");
            }
        }
    };

    return (
        <div className="border-b border-neutral-100 bg-neutral-50/50 px-8 py-6 md:px-12 lg:px-16 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-neutral-500 font-utility">

                {/* Dates */}
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-neutral-400 uppercase tracking-widest text-[10px]">Timeline</span>
                    <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        <span>Created {new Date(Number(note.id)).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>Edited {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-neutral-400 uppercase tracking-widest text-[10px]">Stats</span>
                    <div className="flex items-center gap-2">
                        <Type size={12} />
                        <span>{wordCount} words</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>{readingTime} min read</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                    <span className="font-medium text-neutral-400 uppercase tracking-widest text-[10px]">Tags</span>

                    <div className="flex flex-wrap gap-2">
                        {note.tags && note.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-neutral-200 rounded-md text-neutral-600 shadow-sm">
                                <span># {tag}</span>
                                <button onClick={() => removeTag(note.id, tag)} className="hover:text-red-500 rounded-full p-0.5 transition-colors">
                                    <X size={10} />
                                </button>
                            </span>
                        ))}
                        <div className="relative flex items-center">
                            <Tag size={12} className="absolute left-2 text-neutral-400" />
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add tag..."
                                className="pl-6 pr-3 py-1 bg-white border border-neutral-200 rounded-md placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 w-32 focus:w-48 transition-all"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
