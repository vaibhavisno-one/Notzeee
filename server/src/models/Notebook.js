const mongoose = require('mongoose');

const notebookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    color: {
        type: String,
        default: '#3B82F6', // Default blue color
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for user-scoped queries
notebookSchema.index({ userId: 1, createdAt: -1 });

// Cascade delete notes when notebook is deleted
notebookSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        await mongoose.model('Note').deleteMany({ notebookId: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Notebook', notebookSchema);
