import * as Y from "yjs";
import debounce from "lodash.debounce";
import { Note } from "../models/note.model.js";

const docsByNoteId = new Map();

const createDocState = (note, doc, ytext) => {
    const persist = debounce(async () => {
        const latestContent = ytext.toString();
        await Note.findByIdAndUpdate(note._id, { content: latestContent });
    }, 600);

    const updateListener = () => {
        persist();
    };

    doc.on("update", updateListener);

    return {
        noteId: note._id.toString(),
        doc,
        ytext,
        persist,
        updateListener,
        connections: 0,
    };
};

export const getOrCreateNoteDoc = async (note) => {
    const noteId = note._id.toString();
    const existing = docsByNoteId.get(noteId);
    if (existing) return existing;

    const doc = new Y.Doc();
    const ytext = doc.getText("content");
    const initialContent = note.content || "";
    if (initialContent) {
        ytext.insert(0, initialContent);
    }

    const state = createDocState(note, doc, ytext);
    docsByNoteId.set(noteId, state);
    return state;
};

export const incrementConnections = (noteId) => {
    const state = docsByNoteId.get(noteId);
    if (!state) return;
    state.connections += 1;
};

export const decrementConnections = async (noteId) => {
    const state = docsByNoteId.get(noteId);
    if (!state) return;

    state.connections = Math.max(0, state.connections - 1);
    if (state.connections > 0) return;

    await state.persist.flush();
    state.doc.off("update", state.updateListener);
    state.doc.destroy();
    docsByNoteId.delete(noteId);
};
