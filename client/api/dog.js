import axios  from "axios";

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

export async function addDogImage(token) {
    try {
    } catch (e) {
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



