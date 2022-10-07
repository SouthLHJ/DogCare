
import mongoose from "mongoose";


const memoriesSchema = new mongoose.Schema({
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "account", required: true},
    date: { type: Date, required: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: null },
    public: { type: Boolean, required: true }
});


export default mongoose.model("memories", memoriesSchema);
