const Notebook = require('../models/Notebook');
const Note = require('../models/Note');
const mongoose = require('mongoose');

/**
 * @desc    Create new notebook
 * @route   POST /api/notebooks
 * @access  Private
 */
const createNotebook = async (req, res) => {
    try {
        const { name, color } = req.body;

        // Validation
        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Notebook name is required',
            });
        }

        const notebook = await Notebook.create({
            userId: req.user._id,
            name: name.trim(),
            color: color || '#3B82F6',
        });

        res.status(201).json({
            success: true,
            data: notebook,
        });
    } catch (error) {
        console.error('Create notebook error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Get all notebooks for user
 * @route   GET /api/notebooks
 * @access  Private
 */
const getNotebooks = async (req, res) => {
    try {
        const notebooks = await Notebook.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json({
            success: true,
            count: notebooks.length,
            data: notebooks,
        });
    } catch (error) {
        console.error('Get notebooks error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Update notebook
 * @route   PUT /api/notebooks/:id
 * @access  Private
 */
const updateNotebook = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid notebook ID',
            });
        }

        // Find notebook and verify ownership
        const notebook = await Notebook.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!notebook) {
            return res.status(404).json({
                success: false,
                message: 'Notebook not found',
            });
        }

        // Update fields
        if (name !== undefined) notebook.name = name.trim();
        if (color !== undefined) notebook.color = color;

        await notebook.save();

        res.status(200).json({
            success: true,
            data: notebook,
        });
    } catch (error) {
        console.error('Update notebook error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Delete notebook (and all its notes)
 * @route   DELETE /api/notebooks/:id
 * @access  Private
 */
const deleteNotebook = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid notebook ID',
            });
        }

        // Find notebook and verify ownership
        const notebook = await Notebook.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!notebook) {
            return res.status(404).json({
                success: false,
                message: 'Notebook not found',
            });
        }

        // Delete all notes in this notebook
        await Note.deleteMany({ notebookId: id });

        // Delete notebook
        await Notebook.deleteOne({ _id: id });

        res.status(200).json({
            success: true,
            message: 'Notebook and associated notes deleted successfully',
        });
    } catch (error) {
        console.error('Delete notebook error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    createNotebook,
    getNotebooks,
    updateNotebook,
    deleteNotebook,
};
