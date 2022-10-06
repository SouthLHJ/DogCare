
import mongoose from "mongoose";


const consumeSchema = new mongoose.Schema({
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "account", required: true},
    date: { type: Date, require: true },
    description: {type: String },
    category: {type: String, default: "기타" },
    ammount: { type: Number, require: true },
});


export default mongoose.model("consume", consumeSchema);
