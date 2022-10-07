import axios  from "axios";

const ip = "http://192.168.4.56:8080";

export const readConsumeAll = async(token)=>{
    // console.log("func",token)
    const res = await axios.get(`${ip}/util/consume/allList?token_id=${token}`)
    return res.data
}

export const readConsumeMontly = async(startPoint,endPoint,token)=>{
    const res = await axios.get(`${ip}/util/consume/montlyList?token_id=${token}&startPoint=${startPoint}&endPoint=${endPoint}`)
    return res.data
}

export const writeConsume = async(data, token)=>{
    const res = await axios.post(`${ip}/util/consume/write?token_id=${token}`,data)
    return res.data
}

export const deleteOneConsume = async(id) =>{
    const res = await axios.get(`${ip}/util/consume/delete?_id=${id}`)
    return res.data
}