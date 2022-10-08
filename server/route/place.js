import express from "express";
import Account from "../model/account.js";

const router = express.Router();

router.post("/likeCheck", async (req, res)=>{
    try {
        const {userId, place_id} = req.body;

        const targetUser = await Account.findOne({id: userId}).select("place").lean();

        const checking = targetUser.place.includes(place_id);

        console.log(targetUser);
        res.json({result: true, check: checking});
    } catch (e) {
        res.json({result: false, msg: e.message});
    };
});

router.post("/likeAdd", async (req, res)=>{
    try {
        const {userId, place_id, check} = req.body;
        if(check) {
            const targetUser = await Account.findOneAndUpdate({id: userId}, {$push: {place: place_id}}).lean();
            console.log(targetUser);
        } else {
            const targetUser = await Account.findOneAndUpdate({id: userId}, {$pull: {place: place_id}}).lean();
            console.log(targetUser);
        };
        
        res.json({result: true});
    } catch (e) {
        res.json({result: false, msg: e.message});
    };    
});


router.post("/likeList", async (req, res)=>{
    try {
        const {userId} = req.body;

        const targetUser = await Account.findOne({id: userId}).select("place").lean();
        res.json({result: true, list: targetUser.place});
    } catch (e) {
        res.json({result: false, msg: e.message});
    };    
});




export default router;