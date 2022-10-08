import axios  from "axios";


// const ip = "http://192.168.4.56:8080";
const ip = "http://192.168.35.47:8080/util/account";


export const sendLogin = async(data)=>{
    const res  = await axios.post(`${ip}/login`,data)
    return res.data
}

export const sendRegister = async(data)=>{
    const res  = await axios.post(`${ip}/register`,data)
    return res.data
}

export const sendLogout = async()=>{
    
}