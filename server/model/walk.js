
import mongoose from "mongoose";


const walkSchema = new mongoose.Schema({
    userId: { type: String, require: true},
    date: { type: String, require: true },
    time: { type: Number, require: true },
    memo: { type: String, default: null },
    image: { type: String, default: null }
});


export default mongoose.model("walk", walkSchema);
