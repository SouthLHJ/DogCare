import axios  from "axios";

const ip = "http://221.156.95.190:8080";

export const sendLogin = async(data)=>{
    const res  = await axios.post(`${ip}/util/account/login`,data)
    return res.data
}

export const sendRegister = async(data)=>{
    const res  = await axios.post(`${ip}/util/account/register`,data)
    return res.data
}

export const sendLogout = async()=>{
    
}