
import mongoose from "mongoose";


const memoriesSchema = new mongoose.Schema({
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "account", required: true},
    date: { type: Date, required: true},
    title: { type: String, require: true },
    description: { type: String, require: true },
    image: { type: String, default: null },
    public: { type: Boolean, require: true }
});


export default mongoose.model("memories", memoriesSchema);
