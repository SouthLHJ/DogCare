import express from "express";
import Memories from "../model/memories.js";
import jwt from "jsonwebtoken";
import path from "path"
import fs from "fs"

const router = express.Router();


router.post("/storage/:fileName", (req, resp)=>{ // 추억 사진 저장
    console.log(req.headers["content-type"]);

    const base = path.resolve();
    const wsStrream = fs.createWriteStream(path.join(base, "storage", "memories", req.params.fileName));    

    req.pipe(wsStrream);

    resp.json({result : true, path:"http://192.168.4.56:8080/storage/memories/" + req.params.fileName});
});

router.post("/write", async (req, res)=>{ // 추억 등록
    
    try {
        const verifyToken = jwt.verify(req.body.token_id, process.env.SECRET_KEY);
        const newMemory = Memories.create({userId: verifyToken.token_id, date: req.body.date ?? new Date() , title: req.body.title, description: req.body.description, image: req.body.image ? req.body.image : null , public: req.body.public})

        res.json({result: true, data: newMemory});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
}); 

router.get("/myList", async (req, res)=>{ // 나의 추억 
    
    try {
        console.log(req.query);

        const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);
        const memoriesList = await Memories.find({userId: verifyToken.token_id}).sort("-date").lean();

        console.log(memoriesList);

        res.json({result: true, list: memoriesList });
    } catch(err) {
        res.json({result: false, msg: err.message });
    };
});

router.get("/allList", async (req, res)=>{ // 모두의 추억(공개)
    
    try {
        const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);
        const memoriesList = await Memories.find({ $or: [ {userId: verifyToken.token_id}, { public: true}]}).sort("-date").lean();

        res.json({result: true, list: memoriesList });
    } catch(err) {
        res.json({result: false, msg: err.message });
    };
});


router.post("/edit", async (req, res)=>{ // 추억 수정
    
    try {
        console.log(req.body);
        const haveToDel = req.query.lastImage;

        if(haveToDel) {
            const base = path.resolve();
            const lastFileName = haveToDel.split("/")[(haveToDel.split("/").length) -1]
            fs.rmSync(path.join(base, "storage", "memories", lastFileName));
        };

        const delMemo = await Memories.findByIdAndUpdate(req.body.id, {date: req.body.date, title: req.body.title, description: req.body.description, image: req.body.image ? req.body.image : null, public: req.body.public});

        res.json({result: true, data: delMemo});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});


router.get("/delete", async (req, res)=>{ // 삭제
    try {
        console.log("req.query", req.query);
        const delMemo = await Memories.findByIdAndDelete(req.query.id);

        const haveToDel = delMemo.image;

        if(haveToDel) {
            console.log("haveToDel", haveToDel);
            const base = path.resolve();
            const lastFileName = haveToDel.split("/")[(haveToDel.split("/").length) -1]
            fs.rmSync(path.join(base, "storage", "memories", lastFileName));
        };

        console.log("delMemo", delMemo)
        res.json({result: true, data: delMemo});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});

router.post("/checkAuth", (req, res) => {
    try {
    console.log(req.body)
    const verifyToken = jwt.verify(req.body.token_id, process.env.SECRET_KEY);

    res.json({result: true, checked: req.body.userId === verifyToken.token_id}); 
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});

router.post("/view",async(req,res)=>{
    try {
        const postId = req.query._id;
        const view = req.body.view + 1;
        const rcv =  await Memories.findOneAndUpdate({_id : postId},{view : view})
        // console.log(rcv)
        res.json({result: true, data : rcv}); 
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
})

router.post("/heart",async(req,res)=>{
    try {
        if (req.body.pushLike) {
            const push = await Memories.findByIdAndUpdate(req.body.memories_id, {$push: {heart: req.body.userId}});
        } else {
            const pull = await Memories.findByIdAndUpdate(req.body.memories_id, {$pull: {heart: req.body.userId}});
        };

        res.json({result: true}); 
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
})

export default router;