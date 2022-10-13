import axios  from "axios";

// const ip = "http://192.168.4.56:8080/util/comment";
// const ip = "http://192.168.35.47:8080/util/comment";
const ip  = "http://221.156.95.190:8080/util/comment";


export async function getList(memories_Id) {
    try{
        const res = await axios.get(`${ip}/getList?memories_Id=${memories_Id}`);

        return res.data;
    }catch(e) {
        console.log(e);
    };
};

export async function writeComment(token_id, memories_Id, comment) {
    try{
        const res = await axios.post(`${ip}/write`, {token_id, memories_Id, comment});

        return res.data;
    }catch(e) {
        console.log(e);
    };
};

export async function delComment(id) {
    try{
        const res = await axios.get(`${ip}/getList?comment_Id=${id}`);

        return res.data;
    }catch(e) {
        console.log(e);
    };
};
