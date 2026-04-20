"use client";

import { io } from "socket.io-client";
import * as Y from "yjs";
import Quill from "quill";
import { QuillBinding } from "y-quill";
import "quill/dist/quill.snow.css";
import { api } from "../api";

const SOCKET_PATH = "/notes-collab";
const Y_TEXT_NAME = "content";

const getSocketBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const uint8ToBase64 = (bytes) => {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

const base64ToUint8 = (encoded) => {
    const binary = atob(encoded);
    const output = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        output[i] = binary.charCodeAt(i);
    }
    return output;
};

export const createCollabSession = async ({ noteId, quill, readOnly, onUnauthorized }) => {
    const token = api.getToken();
    if (!token) {
        throw new Error("Missing auth token");
    }

    const socket = io(`${getSocketBaseUrl()}${SOCKET_PATH}`, {
        transports: ["websocket"],
        withCredentials: true,
        auth: { token },
        autoConnect: true,
        reconnection: true,
    });

    const ydoc = new Y.Doc();
    const ytext = ydoc.getText(Y_TEXT_NAME);
    const binding = new QuillBinding(ytext, quill, new Map());

    const emitAck = (event, payload) => {
        return new Promise((resolve, reject) => {
            socket.emit(event, payload, (response) => {
                if (!response?.ok) {
                    return reject(new Error(response?.message || `${event} failed`));
                }
                return resolve(response);
            });
        });
    };
    let hasJoinedOnce = false;

    const sendLocalUpdate = (update) => {
        if (readOnly) return;
        socket.emit("sync-updates", {
            noteId,
            update: uint8ToBase64(update),
        });
    };

    const applyRemoteUpdate = ({ noteId: incomingNoteId, update }) => {
        if (incomingNoteId !== noteId) return;
        const bytes = base64ToUint8(update);
        Y.applyUpdate(ydoc, bytes, "remote");
    };

    const onSocketUnauthorized = (error) => {
        const message = error?.message || "";
        if (message.includes("Unauthorized") || message.includes("Invalid Access Token")) {
            onUnauthorized?.();
        }
    };

    const onYDocUpdate = (update, origin) => {
        if (origin === "remote") return;
        sendLocalUpdate(update);
    };

    const joinAndSync = async () => {
        const joinResponse = await emitAck("join-note", { noteId });
        hasJoinedOnce = true;
        const isReadOnlyRole = joinResponse.role === "viewer";
        quill.enable(!readOnly && !isReadOnlyRole);

        if (joinResponse.update) {
            const bytes = base64ToUint8(joinResponse.update);
            Y.applyUpdate(ydoc, bytes, "remote");
        }

        return joinResponse.role;
    };

    socket.on("connect_error", onSocketUnauthorized);
    socket.on("sync-updates", applyRemoteUpdate);
    const onConnect = () => {
        if (!hasJoinedOnce) return;
        joinAndSync().catch(() => undefined);
    };
    socket.on("connect", onConnect);
    ydoc.on("update", onYDocUpdate);

    const role = await joinAndSync();

    return {
        role,
        ydoc,
        socket,
        binding,
        destroy: async () => {
            socket.off("connect_error", onSocketUnauthorized);
            socket.off("sync-updates", applyRemoteUpdate);
            socket.off("connect", onConnect);
            ydoc.off("update", onYDocUpdate);
            await emitAck("leave-note", { noteId }).catch(() => undefined);
            binding.destroy();
            ydoc.destroy();
            socket.disconnect();
        },
    };
};

export const createQuillEditor = (container, readOnly) => {
    return new Quill(container, {
        theme: "snow",
        readOnly,
        modules: {
            toolbar: readOnly
                ? false
                : [
                    ["bold", "italic", "underline"],
                    [{ header: [1, 2, 3, false] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["blockquote", "code-block"],
                    ["clean"],
                ],
        },
        placeholder: readOnly ? "Read-only" : "Start writing...",
    });
};
