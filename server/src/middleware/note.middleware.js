import { Note } from "../models/note.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { canEditNoteForUser, canReadNoteForUser, getUserRoleForNote } from "../utils/noteAccess.js";

export const loadNote = asyncHandler(async (req, res, next) => {
    const { noteId } = req.params;

    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    const note = await Note.findById(noteId).populate("owner", "username email fullName").populate("collaborators.user", "username email fullName");

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    req.note = note;
    next();
});

export const canReadNote = asyncHandler(async (req, res, next) => {
    const { note, user } = req;

    if (!canReadNoteForUser(note, user._id)) {
        throw new ApiError(403, "You do not have permission to read this note");
    }

    next();
});

export const canEditNote = asyncHandler(async (req, res, next) => {
    const { note, user } = req;

    const role = getUserRoleForNote(note, user._id);
    if (!role) {
        throw new ApiError(403, "You do not have permission to edit this note");
    }

    if (!canEditNoteForUser(note, user._id)) {
        throw new ApiError(403, "Only editors can modify this note");
    }

    next();
});

export const isNoteOwner = asyncHandler(async (req, res, next) => {
    const { note, user } = req;

    const isOwner = note.owner._id.toString() === user._id.toString();

    if (!isOwner) {
        throw new ApiError(403, "Only the owner can perform this action");
    }

    next();
});
