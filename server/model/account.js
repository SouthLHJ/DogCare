
import mongoose from "mongoose";


const accountSchema = new mongoose.Schema({
    id: { type: String, unique: true, require: true}, // 해당 필드 내의 중복된 데이터 거르기
    password: {type: String, require: true},
    name: { type: String, require: true},
    birth: { type: String, default: null},
    contact: { type: Number, unique: true, default: false, require: true},
});


export default mongoose.model("account", accountSchema);
