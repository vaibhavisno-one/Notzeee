"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createCollabSession, createQuillEditor } from "../lib/realtime/collabClient";
import { api } from "../lib/api";

export default function CollaborativeEditor({
    noteId,
    initialContent = "",
    canEdit,
    onRoleResolved,
    onSyncError,
}) {
    const containerRef = useRef(null);
    const quillHostRef = useRef(null);
    const [status, setStatus] = useState("Connecting...");
    const handleUnauthorized = useCallback(() => {
        api.clearTokens();
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
    }, []);

    useEffect(() => {
        const containerEl = containerRef.current;
        if (!containerEl || !noteId) return;

        let isUnmounted = false;
        let session = null;
        quillHostRef.current = document.createElement("div");
        containerEl.innerHTML = "";
        containerEl.appendChild(quillHostRef.current);
        const quill = createQuillEditor(quillHostRef.current, !canEdit);

        // Initial fallback content until socket state arrives.
        quill.setText(initialContent || "");

        const bootstrap = async () => {
            try {
                session = await createCollabSession({
                    noteId,
                    quill,
                    readOnly: !canEdit,
                    onUnauthorized: handleUnauthorized,
                });

                if (isUnmounted) return;
                onRoleResolved?.(session.role);
                setStatus(session.socket.connected ? "Live" : "Reconnecting...");

                session.socket.on("connect", () => setStatus("Live"));
                session.socket.on("disconnect", () => setStatus("Reconnecting..."));
            } catch (error) {
                if (!isUnmounted) {
                    setStatus("Offline");
                    onSyncError?.(error.message || "Failed to initialize collaborative editing");
                }
            }
        };

        bootstrap();

        return () => {
            isUnmounted = true;
            if (session?.socket) {
                session.socket.off("connect");
                session.socket.off("disconnect");
            }
            session?.destroy?.();
            containerEl.innerHTML = "";
        };
    }, [noteId, canEdit, initialContent, onRoleResolved, onSyncError, handleUnauthorized]);

    return (
        <div className="flex flex-col gap-2 h-full min-h-[420px]">
            <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Realtime collaborative mode</span>
                <span className={status === "Live" ? "text-emerald-400" : "text-amber-400"}>
                    {status}
                </span>
            </div>
            <div className="collab-editor-wrapper flex-1 min-h-[360px]">
                <div ref={containerRef} className="h-full" />
            </div>
        </div>
    );
}
