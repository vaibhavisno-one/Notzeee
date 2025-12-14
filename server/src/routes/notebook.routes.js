const express = require('express');
const router = express.Router();
const {
    createNotebook,
    getNotebooks,
    updateNotebook,
    deleteNotebook,
} = require('../controllers/notebook.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// @route   POST /api/notebooks
// @desc    Create new notebook
// @access  Private
router.post('/', createNotebook);

// @route   GET /api/notebooks
// @desc    Get all notebooks for user
// @access  Private
router.get('/', getNotebooks);

// @route   PUT /api/notebooks/:id
// @desc    Update notebook
// @access  Private
router.put('/:id', updateNotebook);

// @route   DELETE /api/notebooks/:id
// @desc    Delete notebook
// @access  Private
router.delete('/:id', deleteNotebook);

module.exports = router;
