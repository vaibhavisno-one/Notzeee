import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
    title: {
        type: String,
        required: false,
        trim: true,
        default: "Untitled"
    },
    content: {
        type: String,
        required: false,
        default: ""
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    collaborators: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            role: {
                type: String,
                enum: ["editor", "viewer"],
                default: "editor"
            }
        }
    ],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }

},
    {
        timestamps: true
    }

)

export const Note = mongoose.model("Note", noteSchema)
