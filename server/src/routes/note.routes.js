import { Router } from "express";
import { createNote, getNoteById, updateNote, deleteNote, addCollaborator, removeCollaborator } from "../controllers/note.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { loadNote, canReadNote, canEditNote, isNoteOwner } from "../middleware/note.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createNote);
router.route("/:noteId").get(verifyJWT, loadNote, canReadNote, getNoteById);
router.route("/:noteId").patch(verifyJWT, loadNote, canEditNote, updateNote);
router.route("/:noteId").delete(verifyJWT, loadNote, isNoteOwner, deleteNote);
router.route("/:noteId/collaborators").post(verifyJWT, loadNote, isNoteOwner, addCollaborator);
router.route("/:noteId/collaborators").delete(verifyJWT, loadNote, isNoteOwner, removeCollaborator);

export default router;
