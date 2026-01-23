import mongoose, {Schema} from "mongoose";

const noteSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true

    },
    content:{
        type:String,
        required:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        required:true,
        default:Date.now
    }
    
},
{
    timestamps:true
}

)

export const Note = mongoose.model("Note",noteSchema)
