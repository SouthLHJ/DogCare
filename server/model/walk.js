
import mongoose from "mongoose";


const walkSchema = new mongoose.Schema({
    userId: { type: String, required: true},
    date: { type: String, required: true },
    time: { type: Number, required: true },
    memo: { type: String, default: null },
    image: { type: String, default: null }
});


export default mongoose.model("walk", walkSchema);
