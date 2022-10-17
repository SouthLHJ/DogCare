import express from "express";
import Dog from "../model/dog.js";
import path from "path"
import fs from "fs"
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
    const verifyToken = jwt.verify(req.body.token_id, process.env.SECRET_KEY);
    
    try {
        const newDog = await Dog.create({name: req.body.name, userId: verifyToken.token_id, image: req.body.image ?? "https://cdn.pixabay.com/photo/2014/03/25/16/24/paw-296964_960_720.png", birth: req.body.birth, gender: req.body.gender ?? "unknown", animalCode: req.body.animalCode, species: req.body.species, extra: req.body.extra});
        
        res.json({result: true, data: newDog});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});

router.post("/edit", async (req, res)=>{ // 강아지 정보 저장
    console.log(req.body);
    const verifyToken = jwt.verify(req.body.token_id, process.env.SECRET_KEY);
    
    try {
        
        const haveToDel = req.body.lastFile;
            if(haveToDel && haveToDel.startsWith("http://192.168.4.56:8080/storage/dog/")) {
            const base = path.resolve();
            const lastFileName = haveToDel.split("/")[(haveToDel.split("/").length) -1];
            fs.rmSync(path.join(base, "storage", "dog", lastFileName));
            };

        const newDog = await Dog.findOneAndUpdate({userId: verifyToken.token_id}, {name: req.body.name, image: req.body.image ?? "https://cdn.pixabay.com/photo/2014/03/25/16/24/paw-296964_960_720.png", birth: req.body.birth, gender: req.body.gender ?? "unknown", animalCode: req.body.animalCode, species: req.body.species, extra: req.body.extra});
        
        res.json({result: true, data: newDog});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});


router.get("/takeMedicine", async (req, res)=>{ // 약 먹음
    try {
        const newDog = await Dog.findByIdAndUpdate(req.query.id, {lastMedicine: new Date()});
        
        res.json({result: true, data: newDog});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});


router.get("/brushTeeth", async (req, res)=>{ // 양치함
    try {
        const newDog = await Dog.findByIdAndUpdate(req.query.id, {lastTeeth: new Date()});
        
        res.json({result: true, data: newDog});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});


router.get("/lastCheck", async (req, res)=>{ // 마지막으로 양치/약 먹은 날
    console.log(req.query);

    try {
        const checkDate = await Dog.findById(req.query.id).select("lastMedicine lastTeeth");
         
        res.json({result: true, data: checkDate});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});


router.get("/delete", async (req, res)=>{ // 삭제
    try {
        const delDog = await Dog.findByIdAndDelete(req.query.dogId);

        const haveToDel = delDog.image;

        if(haveToDel && haveToDel.startsWith("http://192.168.4.56:8080/storage/dog/")) {
            console.log("haveToDel", haveToDel);
            const base = path.resolve();
            const lastFileName = haveToDel.split("/")[(haveToDel.split("/").length) -1]
            fs.rmSync(path.join(base, "storage", "dog", lastFileName));
        };

        res.json({result: true, data: delDog});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
});


export default router;