import { Note } from "../models/note.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllUserNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find({
        $or: [
            { owner: req.user._id },
            { "collaborators.user": req.user._id }
        ]
    })
        .populate("owner", "username email fullName")
        .populate("collaborators.user", "username email fullName")
        .sort({ updatedAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, notes, "Notes fetched successfully")
    );
});

const createNote = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    // Allow empty values with defaults for better UX
    const noteTitle = title?.trim() || "Untitled";
    const noteContent = content || "";

    const note = await Note.create({
        title: noteTitle,
        content: noteContent,
        owner: req.user._id,
        collaborators: []
    });

    const createdNote = await Note.findById(note._id).populate("owner", "username email fullName");

    if (!createdNote) {
        throw new ApiError(500, "Something went wrong while creating the note");
    }

    return res.status(201).json(
        new ApiResponse(201, createdNote, "Note created successfully")
    );
});

const getNoteById = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.note, "Note fetched successfully")
    );
});

const updateNote = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title && !content) {
        throw new ApiError(400, "At least one field (title or content) is required");
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    const updatedNote = await Note.findByIdAndUpdate(
        req.note._id,
        updateData,
        { new: true }
    ).populate("owner", "username email fullName").populate("collaborators.user", "username email fullName");

    if (!updatedNote) {
        throw new ApiError(500, "Something went wrong while updating the note");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedNote, "Note updated successfully")
    );
});

const deleteNote = asyncHandler(async (req, res) => {
    await Note.findByIdAndDelete(req.note._id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Note deleted successfully")
    );
});

const addCollaborator = asyncHandler(async (req, res) => {
    const { username, role = "editor" } = req.body;

    if (!username) {
        throw new ApiError(400, "Username is required");
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const existingCollaborator = req.note.collaborators.find(
        (collab) => collab.user._id.toString() === user._id.toString()
    );

    if (existingCollaborator) {
        throw new ApiError(400, "User is already a collaborator");
    }

    if (req.note.owner._id.toString() === user._id.toString()) {
        throw new ApiError(400, "Owner cannot be added as a collaborator");
    }

    if (!["editor", "viewer"].includes(role)) {
        throw new ApiError(400, "Invalid role. Must be 'editor' or 'viewer'");
    }

    req.note.collaborators.push({ user: user._id, role });
    await req.note.save();

    const updatedNote = await Note.findById(req.note._id)
        .populate("owner", "username email fullName")
        .populate("collaborators.user", "username email fullName");

    return res.status(200).json(
        new ApiResponse(200, updatedNote, "Collaborator added successfully")
    );
});

const removeCollaborator = asyncHandler(async (req, res) => {
    const { username } = req.body;

    if (!username) {
        throw new ApiError(400, "Username is required");
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const collaboratorIndex = req.note.collaborators.findIndex(
        (collab) => collab.user._id.toString() === user._id.toString()
    );

    if (collaboratorIndex === -1) {
        throw new ApiError(404, "Collaborator not found");
    }

    req.note.collaborators.splice(collaboratorIndex, 1);
    await req.note.save();

    const updatedNote = await Note.findById(req.note._id)
        .populate("owner", "username email fullName")
        .populate("collaborators.user", "username email fullName");

    return res.status(200).json(
        new ApiResponse(200, updatedNote, "Collaborator removed successfully")
    );
});

export { getAllUserNotes, createNote, getNoteById, updateNote, deleteNote, addCollaborator, removeCollaborator };

