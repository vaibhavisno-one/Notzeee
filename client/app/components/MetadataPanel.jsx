"use client";

import { useState } from "react";
import { useNotes } from "../context/NotesContext";
import { useAuth } from "../context/AuthContext";
import { Calendar, Clock, Type, Users, X, Plus } from "lucide-react";

export default function MetadataPanel({ note }) {
    const { addCollaborator, removeCollaborator } = useNotes();
    const { user: currentUser } = useAuth();
    const [collaboratorInput, setCollaboratorInput] = useState("");
    const [selectedRole, setSelectedRole] = useState("editor");
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState("");

    if (!note || !currentUser) return null;

    // Determine current user's role
    const isOwner = note.owner._id === currentUser._id;
    const userCollaborator = note.collaborators?.find(c => c.user._id === currentUser._id);
    const userRole = isOwner ? "owner" : (userCollaborator?.role || "viewer");

    const wordCount = note.content ? note.content.trim().split(/\s+/).length : 0;
    const readingTime = Math.ceil(wordCount / 200);

    const handleAddCollaborator = async () => {
        if (!collaboratorInput.trim()) return;

        setIsAdding(true);
        setError("");

        const result = await addCollaborator(note._id, collaboratorInput.trim(), selectedRole);

        if (result.success) {
            setCollaboratorInput("");
            setSelectedRole("editor");
        } else {
            setError(result.error || "Failed to add collaborator");
        }

        setIsAdding(false);
    };

    const handleRemoveCollaborator = async (username) => {
        const result = await removeCollaborator(note._id, username);
        if (!result.success) {
            setError(result.error || "Failed to remove collaborator");
        }
    };

    return (
        <div className="border-b border-neutral-600 bg-neutral-800/50 px-8 py-6 md:px-12 lg:px-16 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-neutral-300 font-utility">

                {/* Dates */}
                <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-neutral-500 uppercase tracking-widest text-[9px]">Timeline</span>
                    <div className="flex items-center gap-2 text-neutral-200 font-medium">
                        <Calendar size={12} className="text-neutral-500" />
                        <span>Created {new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-200 font-medium">
                        <Clock size={12} className="text-neutral-500" />
                        <span>Edited {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-neutral-500 uppercase tracking-widest text-[9px]">Stats</span>
                    <div className="flex items-center gap-2 text-neutral-200 font-medium">
                        <Type size={12} className="text-neutral-500" />
                        <span>{wordCount} words</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-200 font-medium">
                        <Clock size={12} className="text-neutral-500" />
                        <span>{readingTime} min read</span>
                    </div>
                </div>

                {/* Collaborators */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-500 uppercase tracking-widest text-[9px]">Collaborators</span>
                        <span className="text-[10px] text-neutral-400 bg-neutral-700 px-2 py-0.5 rounded">
                            Your role: <span className="text-neutral-200 font-medium capitalize">{userRole}</span>
                        </span>
                    </div>

                    {/* Owner */}
                    <div className="flex items-center gap-2 text-neutral-200 font-medium">
                        <Users size={12} className="text-neutral-500" />
                        <span>{note.owner.username}</span>
                        <span className="text-[10px] text-amber-400 bg-amber-950/30 px-1.5 py-0.5 rounded">Owner</span>
                    </div>

                    {/* Collaborator List */}
                    {note.collaborators && note.collaborators.length > 0 && (
                        <div className="flex flex-col gap-1">
                            {note.collaborators.map(collab => (
                                <div key={collab.user._id} className="flex items-center justify-between gap-2 text-neutral-300 bg-neutral-700/50 px-2 py-1 rounded">
                                    <div className="flex items-center gap-2">
                                        <Users size={10} className="text-neutral-500" />
                                        <span className="text-xs">{collab.user.username}</span>
                                        <span className="text-[9px] text-neutral-400 capitalize">({collab.role})</span>
                                    </div>
                                    {isOwner && (
                                        <button
                                            onClick={() => handleRemoveCollaborator(collab.user.username)}
                                            className="hover:text-red-500 rounded-full p-0.5 transition-colors"
                                            title="Remove collaborator"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Collaborator (Owner Only) */}
                    {isOwner && (
                        <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-neutral-600/50">
                            {error && (
                                <div className="text-[10px] text-red-400 bg-red-950/30 px-2 py-1 rounded">
                                    {error}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={collaboratorInput}
                                    onChange={(e) => setCollaboratorInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCollaborator()}
                                    placeholder="Username..."
                                    className="flex-1 px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                                    disabled={isAdding}
                                />
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-neutral-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                                    disabled={isAdding}
                                >
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                                <button
                                    onClick={handleAddCollaborator}
                                    disabled={isAdding || !collaboratorInput.trim()}
                                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 disabled:text-neutral-500 text-neutral-50 rounded text-xs font-medium transition-colors flex items-center gap-1"
                                >
                                    <Plus size={12} />
                                    Add
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
