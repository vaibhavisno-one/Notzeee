"use client";

import { useState } from "react";
import { useNotes } from "../context/NotesContext";
import { useAuth } from "../context/AuthContext";
import MetadataPanel from "./MetadataPanel";
import CollaborativeEditor from "./CollaborativeEditor";

export default function Editor({ noteId }) {
    const { notes, saveNote, isLoading, showMetadata, isFocusMode } = useNotes();
    const { user: currentUser } = useAuth();

    const [collabRole, setCollabRole] = useState(null);
    const [collabError, setCollabError] = useState("");

    const note = notes.find((n) => n._id === noteId);

    // Determine user's role on this note
    const getUserRole = () => {
        if (!note || !currentUser) return null;
        if (note.owner._id === currentUser._id) return 'owner';
        const collab = note.collaborators?.find(c => c.user._id === currentUser._id);
        return collab?.role || null;
    };

    const userRole = getUserRole();
    const canEdit = userRole === 'owner' || userRole === 'editor';
    const resolvedRole = collabRole || userRole;
    const canEditResolved = resolvedRole === 'owner' || resolvedRole === 'editor';

    // Event handlers
    const handleTitleChange = (e) => {
        if (!canEdit) return;
        const newTitle = e.target.value;
        saveNote(noteId, { title: newTitle });
    };

    if (isLoading) {
        return <LoadingState />;
    }

    if (!note) {
        return <NotFoundState />;
    }

    return (
        <div className={`flex-1 flex flex-col h-full relative ${getPageBackgroundClass(note.pageType)}`}>
            {showMetadata && <MetadataPanel note={note} />}

            {/* Read-only banner for viewers */}
            {resolvedRole === 'viewer' && (
                <div className="bg-amber-950/30 border-b border-amber-800/50 px-8 py-2 text-xs text-amber-400 font-medium flex items-center gap-2">
                    <span>👁️</span>
                    <span>You have view-only access to this note</span>
                </div>
            )}
            {collabError && (
                <div className="bg-red-950/40 border-b border-red-800/50 px-8 py-2 text-xs text-red-300 font-medium">
                    {collabError}
                </div>
            )}

            <div className="w-full mx-auto px-6 py-8 md:px-12 lg:px-16 flex flex-col gap-8 h-full max-w-7xl">
                {/* Title */}
                <TitleInput
                    key={noteId}
                    defaultValue={note.title || ""}
                    onChange={handleTitleChange}
                    isFocusMode={isFocusMode}
                    disabled={!canEditResolved}
                />

                {/* Editor Area */}
                <div className="relative flex-1 w-full flex flex-col">
                    <CollaborativeEditor
                        key={noteId}
                        noteId={noteId}
                        initialContent={note.content || ""}
                        canEdit={canEdit}
                        onRoleResolved={(role) => {
                            setCollabRole(role);
                            setCollabError("");
                        }}
                        onSyncError={(message) => {
                            setCollabError(message);
                        }}
                    />
                </div>

                {/* Empty state */}
                {!note.title && <EmptyState isFocusMode={isFocusMode} />}
            </div>
        </div>
    );
}

// Sub-components

function TitleInput({ defaultValue, onChange, isFocusMode, disabled }) {
    return (
        <input
            type="text"
            defaultValue={defaultValue}
            onChange={onChange}
            placeholder="Untitled Note"
            disabled={disabled}
            className={`text-4xl font-editorial font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 transition-all duration-500 placeholder:text-neutral-400 focus:placeholder:text-indigo-200 ${isFocusMode ? "text-neutral-200 text-center" : "text-neutral-50"} ${disabled ? "cursor-not-allowed opacity-75" : ""}`}
        />
    );
}

function EmptyState({ isFocusMode }) {
    return (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-500 ${isFocusMode ? "opacity-0" : "opacity-40"
            }`}>
            <p className="font-editorial text-xl italic text-neutral-500 text-center">
                &quot;The page is yours. Start writing.&quot;
            </p>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex-1 flex flex-col h-full bg-neutral-800 animate-pulse">
            <div className="max-w-5xl w-full mx-auto px-16 py-12 flex flex-col gap-6">
                <div className="h-10 bg-neutral-700 rounded w-1/2" />
                <div className="h-96 bg-neutral-700 rounded w-full" />
            </div>
        </div>
    );
}

function NotFoundState() {
    return (
        <div className="flex-1 flex items-center justify-center text-neutral-500">
            <p>Note not found.</p>
        </div>
    );
}

// Helper functions

function getPageBackgroundClass(pageType) {
    const baseClass = "transition-colors duration-500";
    const typeClasses = {
        'idea': 'bg-amber-950/20',
        'task': 'bg-blue-950/20',
        'journal': 'bg-stone-950/20'
    };
    return `${baseClass} ${typeClasses[pageType] || 'bg-neutral-800'}`;
}
