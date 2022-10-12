
import mongoose from "mongoose";


const dogSchema = new mongoose.Schema({
    name: { type: String, required: true},
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "account", required: true},
    image: { type: String, default: null },
    birth: {type: String, default: null },
    gender: { type: String, default: "unknown" },
    species: {type: String, default: null },
    animalCode: { type: Number, default: null},
    extra: {type: String, default: null},
    lastMedicine: { type: String, default: null},
    lastTeeth: { type: String, default: null},
});


export default mongoose.model("dog", dogSchema);
