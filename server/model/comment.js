
import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
    userName: { type: String, required: true},
    userId: { type: String, required: true},
    memoriesId: { type: mongoose.SchemaTypes.ObjectId, ref: "memories", required: true},
    date: { type: Date, required: true},
    comment: { type: String, required: true },
});


export default mongoose.model("comment", commentSchema);
