import express from "express";
import Walk from "../model/walk.js";
import jwt from "jsonwebtoken";

const router = express.Router();




router.post("/storage/:fileName", (req, resp)=>{ // 사진 저장
    
    console.log(req.headers["content-type"]);
    const base = path.resolve();
    const wsStrream = fs.createWriteStream(path.join(base, "storage", "walk", req.params.fileName));    
    req.pipe(wsStrream);

    resp.json({result : true, path:"http://192.168.4.56:8080/storage/walk/" + req.params.fileName});

});

router.post("/write", async (req, res)=>{ // 산책 기록 저장
    const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);

    try {
        const newWalk = await Walk.create({userId: verifyToken.token_id, date: new Date(), time: req.body.time, memo: req.body.memo, image: req.body.image });

        res.json({result: true, data: newWalk});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});

router.get("/list", async (req, res)=>{ // 산책 리스트
    const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);

    try {
        const walkList = await Walk.find({userId: verifyToken.token_id}).sort("-date").lean();

        res.json({result: true, list: walkList });
    } catch(err) {
        res.json({result: false, msg: err.message });
    };
});


router.get("/delete", async (req, res)=>{ // 산책 기록 저장
    try {
        const delWalk = await Walk.findByIdAndDelete(req.query._id);

        res.json({result: true, data: delWalk});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});

export default router;