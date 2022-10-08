
import mongoose from "mongoose";


const consumeSchema = new mongoose.Schema({
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "account", required: true},
    date: { type: Date, required: true },
    description: {type: String },
    category: {type: String, default: "기타" },
    ammount: { type: Number, required: true },
});


export default mongoose.model("consume", consumeSchema);
