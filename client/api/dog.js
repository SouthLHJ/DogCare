import axios  from "axios";
import {Buffer} from 'buffer'

const ip = "http://192.168.4.56:8080/util/dog";
// const ip = "http://192.168.35.47:8080/util/dog";
// const ip  = "http://221.156.95.190:8080/util/dog";



export async function getDogInfo(token) {
    try {
        const result = await axios.get(ip + "/getData?token_id=" + token);

        return result.data;
    } catch (e) {
        return {result: false, msg: e.message};
    };
};

export async function addDogImage(data, fileData, fileURI) {
    const fileName = fileURI.substring(fileURI.lastIndexOf("/")+ 1);

    // console.log(fileName);
    try{
        const storageURI = `${ip}/storage/${fileName}`;

        const uploadRes = await axios({
            url: storageURI,
            headers: {
                "Content-type": "image/jpeg"
            },
            data: Buffer.from(fileData, "base64"),
            method: "post"
        });
        
        const item = {...data, image: uploadRes.data.path};
        const realDB = `${ip}/register`;
        const createRes = await axios.post(realDB, item);
        
        return createRes.data;
    } catch (e) {
        console.log(e.message);
    };
};

export async function addDog(data) {
    try {
        const realDB = `${ip}/register`;
        const createRes = await axios.post(realDB, data);
        
        return createRes.data;
    } catch (e) {
        console.log(e.message);
    };
};

export async function editDogImage(data, fileData, fileURI, lastFile) {
    const fileName = fileURI.substring(fileURI.lastIndexOf("/")+ 1);

    try{
        const storageURI = `${ip}/storage/${fileName}`;

        const uploadRes = await axios({
            url: storageURI,
            headers: {
                "Content-type": "image/jpeg"
            },
            data: Buffer.from(fileData, "base64"),
            method: "post"
        });
        
        const item = {...data, image: uploadRes.data.path};
        const realDB = `${ip}/edit`;
        const createRes = await axios.post(realDB, {...item, lastFile: lastFile});
        
        return createRes.data;
    } catch (e) {
        console.log(e.message);
    };
};

export async function editDog(data) {
    try {
        const realDB = `${ip}/edit`;
        const createRes = await axios.post(realDB, data);
        
        return createRes.data;
    } catch (e) {
        console.log(e.message);
    };
};

export async function deletetDog(dogId) {
    try {
        const realDB = `${ip}/delete?dogId=${dogId}`;
        const createRes = await axios.get(realDB);
        
        return createRes.data;
    } catch (e) {
        console.log(e.message);
    };
};

export async function searchCode(data) {
    try{
        const key = process.env.REACT_APP_ANIMALCODE_KEY;
        const uri = `http://apis.data.go.kr/1543061/animalInfoSrvc/animalInfo?${data.regNo ? `dog_reg_no=${data.regNo}`: `rfid_cd=${data.rfid}`}&${data.ownerName ? `owner_nm=${data.ownerName}` : `owner_birth=${data.ownerBirth}`}&serviceKey=${key}&_type=json`

        const res = await axios.get(uri);
        console.log(res.data.response.body);

        return {result: true, item: res.data.response.body.item}
    } catch(e) {
        return {result: false, msg: e.message};
    }
};

export async function checkingTeeth(id) {
    try{
        const res = await axios.get(`${ip}/brushTeeth?id=${id}`);

        return res.data;
    }catch (e) {
        return {result: false, msg: e.message};
    };
};

export async function checkingMedicine(id) {
    try{
        const res = await axios.get(`${ip}/takeMedicine?id=${id}`);

        return res.data;
    }catch (e) {
        return {result: false, msg: e.message};
    };
};

export async function getChecked(id) {
    try{
        const res = await axios.get(`${ip}/lastCheck?id=${id}`);

        return res.data;
    }catch (e) {
        return {result: false, msg: e.message};
    };
};



