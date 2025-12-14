const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    notebookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notebook',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    content: {
        type: mongoose.Schema.Types.Mixed, // Rich text JSON from editor
        default: {},
    },
    pageType: {
        type: String,
        enum: ['default', 'ruled', 'grid', 'dotted'],
        default: 'default',
    },
    pageColor: {
        type: String,
        default: '#FFFFFF',
        trim: true,
    },
    margins: {
        type: String,
        enum: ['narrow', 'normal', 'wide'],
        default: 'normal',
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

// Indexes for efficient queries
noteSchema.index({ userId: 1, notebookId: 1 });
noteSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });
noteSchema.index({ userId: 1, isArchived: 1 });

module.exports = mongoose.model('Note', noteSchema);
