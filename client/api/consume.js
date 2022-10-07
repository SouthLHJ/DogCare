import axios  from "axios";

const ip = "http://192.168.4.56:8080";

export const readConsumeList = async(data, token)=>{
    const res = await axios.get(`${ip}/util/consume/list?token=${token}`)
    return res.data
}

export const writeConsume = async(data, token)=>{
    const res = await axios.get(`${ip}/util/consume/write?token=${token}`,data)
    return res.data
}