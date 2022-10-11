import express from "express";
import jwt from "jsonwebtoken";
import Consume from "../model/consume.js";

const router = express.Router();

router.post("/write", async (req, res)=>{ // 소비 등록
    const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);

    try {
        const newConsume = await Consume.create({userId: verifyToken.token_id, date: req.body.date, description: req.body.description, category: req.body.category ?? "기타", ammount: req.body.ammount})

        res.json({result: true, data: newConsume });
    } catch(err) {
        res.json({result: false, msg: err.message });
    };
});


router.get("/allList", async (req, res)=>{ // 모든 소비 목록
    const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);
    
    try {
        const consumeList = await Consume.find({userId: verifyToken.token_id}).sort("-date").lean();

        res.json({result: true, list: consumeList });
    } catch(err) {
        res.json({result: false, msg: err.message });
    };
});


router.get("/montlyList", async (req, res)=>{ // 이번달 소비 목록
    const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);
    const start = new Date(req.query.startPoint).setHours(0);
    const end = new Date(req.query.endPoint).setHours(23,59,59);

    try {
        const consumeList = await Consume.find({userId: verifyToken.token_id})
            .where("date").gte(start).lte(end)
            .sort("-date").lean();

        res.json({result: true, list: consumeList });
    } catch(err) {
        res.json({result: false, msg: err.message });
    };
});


router.get("/delete", async (req, res)=>{ // 소비 내역 삭제
    try {
        const delConsume = await Consume.findByIdAndDelete(req.query._id);

        res.json({result: true, data: delConsume});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});



export default router;