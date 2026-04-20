import { Note } from "../models/note.model.js";
import * as Y from "yjs";
import { canEditNoteForUser, canReadNoteForUser, getUserRoleForNote } from "../utils/noteAccess.js";
import { getOrCreateNoteDoc, incrementConnections, decrementConnections } from "./noteDocManager.js";

const NOTE_ROOM_PREFIX = "note:";

const getRoomName = (noteId) => `${NOTE_ROOM_PREFIX}${noteId}`;

export const registerNoteCollabNamespace = (io) => {
    const namespace = io.of("/notes-collab");

    namespace.on("connection", (socket) => {
        socket.currentNoteId = null;
        socket.currentRole = null;

        socket.on("join-note", async (payload = {}, ack) => {
            try {
                const { noteId } = payload;
                if (!noteId) {
                    throw new Error("noteId is required");
                }

                const note = await Note.findById(noteId);
                if (!note) {
                    throw new Error("Note not found");
                }

                if (!canReadNoteForUser(note, socket.user._id)) {
                    throw new Error("You do not have permission to read this note");
                }

                if (socket.currentNoteId && socket.currentNoteId !== noteId) {
                    const previousRoom = getRoomName(socket.currentNoteId);
                    socket.leave(previousRoom);
                    await decrementConnections(socket.currentNoteId);
                }

                const role = getUserRoleForNote(note, socket.user._id);
                const roomName = getRoomName(noteId);
                const state = await getOrCreateNoteDoc(note);
                const isAlreadyJoined = socket.currentNoteId === noteId;

                socket.join(roomName);
                socket.currentNoteId = noteId;
                socket.currentRole = role;
                if (!isAlreadyJoined) {
                    incrementConnections(noteId);
                }

                const fullState = Buffer.from(Y.encodeStateAsUpdate(state.doc));
                const response = {
                    ok: true,
                    role,
                    update: fullState.toString("base64"),
                };

                if (typeof ack === "function") {
                    ack(response);
                }
            } catch (error) {
                if (typeof ack === "function") {
                    ack({ ok: false, message: error.message || "Failed to join note" });
                }
            }
        });

        socket.on("sync-updates", async (payload = {}, ack) => {
            try {
                const { noteId, update } = payload;
                if (!noteId || !update) {
                    throw new Error("noteId and update are required");
                }

                if (socket.currentNoteId !== noteId) {
                    throw new Error("Join note before syncing updates");
                }

                const note = await Note.findById(noteId);
                if (!note || !canEditNoteForUser(note, socket.user._id)) {
                    throw new Error("Only editors can modify this note");
                }

                const state = await getOrCreateNoteDoc(note);
                const updateBuffer = Buffer.from(update, "base64");
                const roomName = getRoomName(noteId);

                Y.applyUpdate(state.doc, new Uint8Array(updateBuffer));

                socket.to(roomName).emit("sync-updates", {
                    noteId,
                    update,
                    actorId: socket.user._id.toString(),
                });

                if (typeof ack === "function") {
                    ack({ ok: true });
                }
            } catch (error) {
                if (typeof ack === "function") {
                    ack({ ok: false, message: error.message || "Sync failed" });
                }
            }
        });

        socket.on("leave-note", async (payload = {}, ack) => {
            const noteId = socket.currentNoteId;
            if (!noteId) {
                if (typeof ack === "function") ack({ ok: true });
                return;
            }

            const roomName = getRoomName(noteId);
            socket.leave(roomName);

            if (socket.currentNoteId === noteId) {
                socket.currentNoteId = null;
                socket.currentRole = null;
            }

            await decrementConnections(noteId);
            if (typeof ack === "function") ack({ ok: true });
        });

        socket.on("disconnect", async () => {
            if (socket.currentNoteId) {
                await decrementConnections(socket.currentNoteId);
                socket.currentNoteId = null;
                socket.currentRole = null;
            }
        });
    });
};
