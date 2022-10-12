import express from "express";
import Account from "../model/account.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res)=>{ // 회원가입
    console.log(req.body);

    if( !(/[a-z0-9]{4,}/.test(req.body.id) && /[a-zA-Z0-9`~!@#$%^&*]/.test(req.body.password)) ) {
        res.json({result: false, msg: "아이디 또는 비밀번호가 형식에 맞지 않습니다."});

    }else {
        const hash = await bcrypt.hash(req.body.password, 10);
        
        try {
            const acclist = await Account.find({}).select("contact");
            const sameContact = acclist.filter((one) => {one.contact === req.body.contact});
            if(sameContact.length > 0) {
                res.json({result: false, msg: "입력하신 번호는 다른 유저가 사용중인 번호입니다."});
            } else {
                const result = await Account.create({id: req.body.id, password: hash, name: req.body.name, birth: req.body.birth, contact: req.body.contact});
                res.json({result: true, data: result});
            };            
        } catch(err) {
            res.json({result: false, msg: err.message});
        };
    }
});


router.post("/login", async (req, res)=>{ // 로그인
    console.log(req.body);
    try{
        const findAccount = await Account.findOne({id: req.body.id}).lean();
        
        if(findAccount) {
            const passCheck = await bcrypt.compare(req.body.password, findAccount.password);
            if(!passCheck) {
                res.json({ result: false, msg: "존재하지 않는 계정 혹은 비밀번호 입니다." });
            } else {
                const token = jwt.sign({ token_id: findAccount._id }, process.env.SECRET_KEY);
                res.json({ result: true, token, msg: `${findAccount.name}님 환영합니다.` });
            };
        } else {
            res.json({ result: false, msg: "존재하지 않는 계정 혹은 비밀번호 입니다." });
        };
    } catch (e) {
        res.json({ result: false, msg: e.message });
    };
});

router.post("/read",async(req,res)=>{
    try{
        const findAccount = await Account.findOne({id: req.body.id}).lean();
        res.json({result : true, data : findAccount})
    }catch(e){
        res.json({result : false, msg : e.message})
    }
})

router.post("/userId", async(req,res)=>{
    try{
        const findAccount = await Account.findOne({_id: req.body._id}).select("name").lean();
        res.json({result : true, data : findAccount})
    }catch(e){
        res.json({result : false, msg : e.message})
    }
})

router.post("/edit",async(req,res)=>{
    try{
        const edit = await Account.findOneAndUpdate({id : req.body.id},{
            birth: req.body.birth,
            // contact: req.body.contact,
            name: req.body.name, 
            password: req.body.password,
            place : req.body.place});

        res.json({result: true, data: edit});
    }catch(e){
        res.json({result : false, msg : e.message})
    }
})

export default router;