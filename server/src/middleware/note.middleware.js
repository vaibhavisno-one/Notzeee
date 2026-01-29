import { Note } from "../models/note.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

    const isOwner = note.owner._id.toString() === user._id.toString();
    const isCollaborator = note.collaborators.some(
        (collab) => collab.user._id.toString() === user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
        throw new ApiError(403, "You do not have permission to read this note");
    }

    next();
});

export const canEditNote = asyncHandler(async (req, res, next) => {
    const { note, user } = req;

    const isOwner = note.owner._id.toString() === user._id.toString();

    if (isOwner) {
        return next();
    }

    const collaborator = note.collaborators.find(
        (collab) => collab.user._id.toString() === user._id.toString()
    );

    if (!collaborator) {
        throw new ApiError(403, "You do not have permission to edit this note");
    }

    if (collaborator.role !== "editor") {
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
