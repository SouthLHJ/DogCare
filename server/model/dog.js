
import mongoose from "mongoose";


const dogSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true}, // 해당 필드 내의 중복된 데이터 거르기
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "account", required: true},
    image: { type: String, default: null },
    birth: {type: String, default: null },
    gender: { type: String, default: null },
    animalCode: { type: Number, default: null},
    lastMedicine: { type: String, default: null},
    lastTeeth: { type: String, default: null},
});


export default mongoose.model("dog", dogSchema);
