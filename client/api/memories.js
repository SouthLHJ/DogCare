import axios  from "axios";
import {Buffer} from 'buffer'



const ip = "http://192.168.35.47:8080/util/memories";




export async function getMyList(token) {
    console.log(token)
    try{
        const res = await axios.get(`${ip}/myList?token_id=${token}`);

        return res.data;
    }catch(e) {
        console.log(e);
    };
};

export async function getAllList(token) {
    try{
        const res = await axios.get(`${ip}/allList?token_id=${token}`);

        return res.data;
    }catch(e) {
        console.log(e);
    };
}


export async function writeMemoriesImage(data, fileData, fileURI) {
    const fileName = fileURI.substring(fileURI.lastIndexOf("/")+ 1); // 파일 이름 저장

    try{
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
        const createRes = await axios.post(realDB, item); // 데이터 베이스에 정보 저장하는 용
        
        return createRes.data;
    } catch (e) {
        console.log(e.message);
    };
};

export async function writeMemories(data) {
    try{
        const createRes = await axios.post(`${ip}/write`, data); // 데이터 베이스에 정보 저장하는 용
        
        return createRes.data;
    } catch (e) {
        console.log(e.message);
    };
};

export async function editMemoriesImage(data, fileData, fileURI, lastfile, id) {
    const fileName = fileURI.substring(fileURI.lastIndexOf("/")+ 1); // 파일 이름 저장

    try{
        const storageURI = `${ip}/storage/${fileName}`; // 해당 경로로 파일 이름을 params로 전달

        const uploadRes = await axios({ // 사진 저장하는 uri
            url: storageURI,
            headers: {
                "Content-type": "image/jpeg"
            },
            data: Buffer.from(fileData, "base64"),
            method: "post"
        });
        
        const item = {...data, image: uploadRes.data.path, lastImage: lastfile, id: id}; // 위에서 응답으로 받은 이미지 path값과 저장할 데이터들 묶어주기
        const realDB = `${ip}/edit`; // memories, walk는 write
        const createRes = await axios.post(realDB, item); // 데이터 베이스에 정보 저장하는 용
        
        return createRes.data;
    } catch (e) {
        console.log(e.message);
    };
};

export async function editMemories(data, image, id) {
    try{
        const createRes = await axios.post(`${ip}/edit`, {...data, image: image, id: id}); // 데이터 베이스에 정보 저장하는 용
        
        return createRes.data;
    } catch (e) {
        console.log(e.message);
    };
};


export async function checkAuth(token, id) {
    console.log(token+  "그리고" +id);
    try{
        const createRes = await axios.post(`${ip}/checkAuth`, {token_id: token, userId: id});


        return createRes.data;
    } catch (e) {
        console.log(e.message);
    };
};



export async function deleteMemory(id) {
    try{
        const createRes = await axios.get(`${ip}/delete?id=${id}`);


        return createRes.data;
    } catch (e) {
        console.log(e.message);
    };
};