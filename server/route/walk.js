import express from "express";
import Walk from "../model/walk.js";
import jwt from "jsonwebtoken";
import axios from "axios"
import path from "path"
import fs from "fs"


const router = express.Router();


router.get("/weather",async(req,res)=>{
    const key = "oDtrqrff3ZdIF5EMB%2FvexXvzsZtmLbgpmzK9RPUArCS7CDaPhUBMC5XjUQT1RgyY%2BOs%2FSXE8RZMTYxTbFssszg%3D%3D";  
    const date = req.query.date;
    const time = req.query.time;
    const x = req.query.x;
    const y = req.query.y;
    console.log(date,time,x,y)
    try{
        const rcv  = await axios.get(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${key}&pageNo=1&numOfRows=15&dataType=JSON&base_date=${date}&base_time=${time}00&nx=${x}&ny=${y}`)
        res.json({result : true , data : rcv})
    }catch(e){
        console.log(e.message)        
    }
})


router.post("/storage/:fileName", (req, resp)=>{ // 사진 저장
    
    console.log(req.headers["content-type"]);
    const base = path.resolve();
    const wsStrream = fs.createWriteStream(path.join(base, "storage", "walk", req.params.fileName));    
    req.pipe(wsStrream);

    resp.json({result : true, path:"http://192.168.4.56:8080/storage/walk/" + req.params.fileName});

});

router.post("/write", async (req, res)=>{ // 산책 기록 저장
    
    try {
        const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);
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


router.get("/delete", async (req, res)=>{ // 산책 기록 삭제
    try {
        const delWalk = await Walk.findByIdAndDelete(req.query._id);

        res.json({result: true, data: delWalk});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});

export default router;