import express from "express";
import Account from "../model/account.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res)=>{ // 회원가입
    console.log(req.body);
    const hash = await bcrypt.hash(req.body.password, 10);

    try {
        const result = await Account.create({id: req.body.id, password: hash, name: req.body.name, birth: req.body.birth, contact: req.body.contact});

        res.json({result: true, data: result});
    } catch(err) {
        res.json({result: false, msg: err.message});
    };
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



export default router;