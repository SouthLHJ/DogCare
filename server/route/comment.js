import express from "express";
import jwt from "jsonwebtoken";
import Comment from "../model/comment.js";
import Account from "../model/account.js";

const router = express.Router();

router.post("/write", async (req, res)=>{
    const verifyToken = jwt.verify(req.body.token_id, process.env.SECRET_KEY);
    
    try {
        const user = await Account.findById(verifyToken.token_id).select("id name");
        const newComment = await Comment.create({userName: user.name, userId: user.id, memoriesId: req.body.memories_Id, date: new Date(), comment: req.body.comment})

        res.json({result: true, comment: newComment });
    } catch(err) {
        res.json({result: false, msg: err.message });
    };
});

router.get("/getList", async (req, res)=>{ 
    try {
        const list = await Comment.find({memoriesId: req.query.memories_Id})

        res.json({result: true, list: list });
    } catch(err) {
        res.json({result: false, msg: err.message });
    };
});

router.get("/delete", async (req, res)=>{ 
    try {
        const check = await Comment.findByIdAndDelete(req.query.comment_id)

        res.json({result: true, check: check });
    } catch(err) {
        res.json({result: false, msg: err.message });
    };
});



export default router;