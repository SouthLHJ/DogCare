import axios from "axios";
import {Buffer} from 'buffer'



export const readWeather = ()=>{
    const res  = axios.post("날씨")
    return {weather : "맑음", heat : "19"}
}

