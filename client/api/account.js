import axios  from "axios";

const ip = "http://192.168.4.56:8080";

export const sendLogin = async(data)=>{
    const res  = await axios.post(`${ip}/util/account/login`,data)
    return res
}

export const sendRegister = async(data)=>{
    const res  = await axios.post(`${ip}/util/account/register`,data)
    return res
}

export const sendLogout = async()=>{
    
}