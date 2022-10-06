import express from "express";
import Dog from "../model/dog.js";
import jwt from "jsonwebtoken";

const router = express.Router();


router.get("/getData", async (req, res)=>{ // 강아지 정보 받아오기
    console.log(req.query);
    const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);

    try {
        const findDog = await Dog.findOne({userId: verifyToken.token_id});

        res.json({result: true, data: findDog});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});



router.post("/storage/:fileName", (req, resp)=>{ // 강아지 사진 저장
    console.log(req.headers["content-type"]);

    const base = path.resolve();
    const wsStrream = fs.createWriteStream(path.join(base, "storage", "dog", req.params.fileName));    
    
    req.pipe(wsStrream);

    resp.json({result : true, path:"http://192.168.4.56:8080/storage/dog/" + req.params.fileName});
});


router.post("/register", async (req, res)=>{ // 강아지 정보 저장
    console.log(req.body);
    const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);

    try {
        const newDog = await Dog.create({name: req.body.name, userId: verifyToken.token_id, image: req.body.image, birth: req.body.birth, gender: req.body.gender, animalCode: req.body.animalCode});
        
        res.json({result: true, data: newDog});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});


router.get("/takeMedicine", async (req, res)=>{ // 약 먹음
    console.log(req.body);
    const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);

    try {
        const newDog = await Dog.findOneAndUpdate({userId: verifyToken.token_id}, {lastMedicine: new Date()});
        
        res.json({result: true, data: newDog});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});


router.get("/brushTeeth", async (req, res)=>{ // 양치함
    console.log(req.body);
    const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);

    try {
        const newDog = await Dog.findOneAndUpdate({userId: verifyToken.token_id}, {lastMedicine: new Date()});
        
        res.json({result: true, data: newDog});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});


router.get("/lastCheck", async (req, res)=>{ // 마지막으로 양치/약 먹은 날
    console.log(req.query);
    const verifyToken = jwt.verify(req.query.token_id, process.env.SECRET_KEY);

    try {
        const checkDate = await Dog.findOne({userId: verifyToken.token_id}).select("lastMedicine lastTeeth");
        
        res.json({result: true, data: checkDate});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});


router.get("/delete", async (req, res)=>{ // 삭제
    try {
        const delDog = await Dog.findByIdAndDelete(req.query._id);

        res.json({result: true, data: delDog});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});


export default router;