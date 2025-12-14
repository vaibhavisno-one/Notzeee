const Note = require('../models/Note');
const Notebook = require('../models/Notebook');
const mongoose = require('mongoose');

/**
 * @desc    Create new note
 * @route   POST /api/notes
 * @access  Private
 */
const createNote = async (req, res) => {
    try {
        const {
            notebookId,
            title,
            content,
            pageType,
            pageColor,
            margins,
            isPinned,
            isArchived,
        } = req.body;

        // Validation
        if (!notebookId || !title) {
            return res.status(400).json({
                success: false,
                message: 'Notebook ID and title are required',
            });
        }

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(notebookId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid notebook ID',
            });
        }

        // Verify notebook exists and belongs to user
        const notebook = await Notebook.findOne({
            _id: notebookId,
            userId: req.user._id,
        });

        if (!notebook) {
            return res.status(404).json({
                success: false,
                message: 'Notebook not found',
            });
        }

        const note = await Note.create({
            userId: req.user._id,
            notebookId,
            title: title.trim(),
            content: content || {},
            pageType: pageType || 'default',
            pageColor: pageColor || '#FFFFFF',
            margins: margins || 'normal',
            isPinned: isPinned || false,
            isArchived: isArchived || false,
        });

        res.status(201).json({
            success: true,
            data: note,
        });
    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Get all notes for user (with optional filters)
 * @route   GET /api/notes?notebookId=xxx&isPinned=true&isArchived=false
 * @access  Private
 */
const getNotes = async (req, res) => {
    try {
        const { notebookId, isPinned, isArchived } = req.query;

        // Build query
        const query = { userId: req.user._id };

        if (notebookId) {
            if (!mongoose.Types.ObjectId.isValid(notebookId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid notebook ID',
                });
            }
            query.notebookId = notebookId;
        }

        if (isPinned !== undefined) {
            query.isPinned = isPinned === 'true';
        }

        if (isArchived !== undefined) {
            query.isArchived = isArchived === 'true';
        }

        const notes = await Note.find(query)
            .sort({ isPinned: -1, updatedAt: -1 })
            .select('-__v')
            .populate('notebookId', 'name color');

        res.status(200).json({
            success: true,
            count: notes.length,
            data: notes,
        });
    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Get single note
 * @route   GET /api/notes/:id
 * @access  Private
 */
const getNote = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid note ID',
            });
        }

        const note = await Note.findOne({
            _id: id,
            userId: req.user._id,
        })
            .select('-__v')
            .populate('notebookId', 'name color');

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found',
            });
        }

        res.status(200).json({
            success: true,
            data: note,
        });
    } catch (error) {
        console.error('Get note error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Update note
 * @route   PUT /api/notes/:id
 * @access  Private
 */
const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            content,
            pageType,
            pageColor,
            margins,
            isPinned,
            isArchived,
            notebookId,
        } = req.body;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid note ID',
            });
        }

        // Find note and verify ownership
        const note = await Note.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found',
            });
        }

        // If changing notebook, verify new notebook exists and belongs to user
        if (notebookId && notebookId !== note.notebookId.toString()) {
            if (!mongoose.Types.ObjectId.isValid(notebookId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid notebook ID',
                });
            }

            const notebook = await Notebook.findOne({
                _id: notebookId,
                userId: req.user._id,
            });

            if (!notebook) {
                return res.status(404).json({
                    success: false,
                    message: 'Notebook not found',
                });
            }

            note.notebookId = notebookId;
        }

        // Update fields
        if (title !== undefined) note.title = title.trim();
        if (content !== undefined) note.content = content;
        if (pageType !== undefined) note.pageType = pageType;
        if (pageColor !== undefined) note.pageColor = pageColor;
        if (margins !== undefined) note.margins = margins;
        if (isPinned !== undefined) note.isPinned = isPinned;
        if (isArchived !== undefined) note.isArchived = isArchived;

        await note.save();

        res.status(200).json({
            success: true,
            data: note,
        });
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Delete note
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid note ID',
            });
        }

        // Find note and verify ownership
        const note = await Note.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found',
            });
        }

        await Note.deleteOne({ _id: id });

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully',
        });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
};
