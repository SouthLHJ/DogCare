import express from "express";
import Memories from "../model/memories.js";
import jwt from "jsonwebtoken";

const router = express.Router();


router.post("/storage/:fileName", (req, resp)=>{ // 추억 사진 저장
    console.log(req.headers["content-type"]);

    const base = path.resolve();
    const wsStrream = fs.createWriteStream(path.join(base, "storage", "memories", req.params.fileName));    

    req.pipe(wsStrream);

    resp.json({result : true, path:"http://192.168.4.56:8080/storage/memories/" + req.params.fileName});
});

router.post("/write", async (req, res)=>{ // 추억 등록
    const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);

    try {
        const newMemory = Memories.create({userId: verifyToken, date: req.body.date ?? new Date , title: req.body.title, description: req.body.description, image: req.body.image, public: req.body.public})

        res.json({result: true, data: newMemory});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});

router.get("/myList", async (req, res)=>{ // 나의 추억
    const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);

    try {
        const memoriesList = await Memories.find({userId: verifyToken}).sort("-date").lean();

        res.json({result: true, list: memoriesList });
    } catch(err) {
        res.json({result: false, msg: err.message });
    };
});

router.get("/allList", async (req, res)=>{ // 모두의 추억(공개)
    try {
        const memoriesList = await Memories.find({public: true}).sort("-date").lean();

        res.json({result: true, list: memoriesList });
    } catch(err) {
        res.json({result: false, msg: err.message });
    };
});


router.get("/edit", async (req, res)=>{ // 추억 수정
    try {
        const delMemo = await Memories.findByIdAndUpdate(req.query._id, {date: req.body.date, title: req.body.title, description: req.body.description, image: req.body.image, public: req.body.public});

        res.json({result: true, data: delMemo});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});


router.get("/delete", async (req, res)=>{ // 삭제
    try {
        const delMemo = await Memories.findByIdAndDelete(req.query._id);

        res.json({result: true, data: delMemo});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});



export default router;