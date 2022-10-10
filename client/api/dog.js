import axios  from "axios";
import {Buffer} from 'buffer'

// const ip = "http://192.168.4.56:8080";
const ip = "http://192.168.35.47:8080/util/dog";


export async function getDogInfo(token) {
    try {
        const result = await axios.get(ip + "/getData?token_id=" + token);

        return result.data;
    } catch (e) {
        return {result: false, msg: e.message};
    };
};

export async function addDogImage(data, fileData, fileURI) {
    const fileName = fileURI.substring(fileURI.lastIndexOf("/")+ 1) + "/" + data.name;

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

export async function addDog(token) {
    try {
    } catch (e) {
    };
};

export async function editDogImage(token) {
    try {
    } catch (e) {
    };
};

export async function editDog(token) {
    try {
    } catch (e) {
    };
};



