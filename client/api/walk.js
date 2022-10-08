import axios from "axios";
import {Buffer} from 'buffer'


const ip = "http://221.156.95.190:8080/util/walk"

// 응답 코드 체크용 (기억용)
function code (){
    const value = ["POP",'PTY','PCP','REH','SNO','SKY','TMP','TMN','TMX',"UUU","VVV","WAV","VEC","WSD"]
    const com = ["강수확률",'강수형태','1시간 강수량','습도','1시간 신적설','하늘상태','1시간 기온','일 최저기온','일 최고기온',"풍속(동서성분)","풍속(남북성분)","파고","풍향","풍속"]

    const timeIndex = ["02", "05", "08", "11", "14", "17", "20", "23"]
}

const key = "oDtrqrff3ZdIF5EMB%2FvexXvzsZtmLbgpmzK9RPUArCS7CDaPhUBMC5XjUQT1RgyY%2BOs%2FSXE8RZMTYxTbFssszg%3D%3D";  

export const readWeather = async(time,x=55,y=126)=>{
    const date = `${new Date().getFullYear()}`+`${new Date().getMonth()+1}`.padStart(2,"0")+`${new Date().getDate()}`.padStart(2,"0")

    // console.log(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${key}&pageNo=1&numOfRows=15&dataType=JSON&base_date=${date}&base_time=${time}00&nx=${x}&ny=${y}`)
    // const res  = await axios.get(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${key}&pageNo=1&numOfRows=15&dataType=JSON&base_date=${date}&base_time=${time}00&nx=${x}&ny=${y}`)
    // console.log("readweather",res.body)

    // const rcv = await axios.get(`http://221.156.95.190:8080/util/walk/weather?date=${date}&time=${time}&x=${x}&y=${y}`)

    return {weather :"맑음", heat : "17"}
}

export const writeWalkImage = async(data, fileData, fileURI)=>{
    const fileName = fileURI.substring(fileURI.lastIndexOf("/")+ 1); // 파일 이름 저장

    const storageURI = `${ip}/storage/${fileName}`; // 해당 경로로 파일 이름을 params로 전달

    const uploadRes = await axios({ // 사진 저장하는 uri
        url: storageURI,
        headers: {
            "Content-type": "image/jpeg"
        },
        data: Buffer.from(fileData, "base64"),
        method: "post"
    });
    
    const item = {...data, image: uploadRes.data.path}; // 위에서 응답으로 받은 이미지 path값과 저장할 데이터들 묶어주기
    const realDB = `${ip}/write`; // memories, walk는 write
    const res = await axios.post(realDB, item); // 데이터 베이스에 정보 저장하는 용
    
    return res.data;
}

export const writeWalk = async(data)=>{
    const res = await axios.post(`${ip}/write`, data); // 데이터 베이스에 정보 저장하는 용
    
    return res.data;
}

export const getWalkList = async(token) =>{
    const res = await axios.get(`${ip}/list?token_id=${token}`);

    return res.data;
}

export async function deleteWalk(id) {
    try{
        const res = await axios.get(`${ip}/delete?id=${id}`);


        return res.data;
    } catch (e) {
        console.log(e.message);
    };
};