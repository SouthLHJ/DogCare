import axios  from "axios";



const ip = "http://221.156.95.190:8080/util/consume";


export const readConsumeAll = async(token)=>{
    // console.log("func",token)
    const res = await axios.get(`${ip}/allList?token_id=${token}`)
    return res.data
}

export const readConsumeMontly = async(startPoint,endPoint,token)=>{
    const res = await axios.get(`${ip}/montlyList?token_id=${token}&startPoint=${startPoint}&endPoint=${endPoint}`)
    return res.data
}

export const writeConsume = async(data, token)=>{
    const res = await axios.post(`${ip}/write?token_id=${token}`,data)
    return res.data
}

export const deleteOneConsume = async(id) =>{
    const res = await axios.get(`${ip}/delete?_id=${id}`)
    return res.data
}