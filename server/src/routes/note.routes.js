const express = require('express');
const router = express.Router();
const {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
} = require('../controllers/note.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// @route   POST /api/notes
// @desc    Create new note
// @access  Private
router.post('/', createNote);

// @route   GET /api/notes
// @desc    Get all notes for user (with optional filters)
// @access  Private
router.get('/', getNotes);

// @route   GET /api/notes/:id
// @desc    Get single note
// @access  Private
router.get('/:id', getNote);

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private
router.put('/:id', updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private
router.delete('/:id', deleteNote);

module.exports = router;
