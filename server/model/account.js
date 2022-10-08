
import mongoose from "mongoose";


const accountSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true}, // 해당 필드 내의 중복된 데이터 거르기
    password: {type: String, required: true},
    name: { type: String, required: true},
    birth: { type: String, default: null},
    contact: { type: Number, unique: true, default: false, required: true},
    place: { type: Array, default: []},
});


export default mongoose.model("account", accountSchema);
