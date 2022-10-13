import axios from "axios";

const GOOGLE_APP_KEY = "AIzaSyAYhpmoUdICrtRsjJhBScxxR2cdY4gzpBM";
// const ip = "http://192.168.4.56:8080/util/place";
// const ip = "http://192.168.35.47:8080/util/place";
const ip  = "http://221.156.95.190:8080/util/place";



export async function sendLikeCheckRequest(userId, place_id) {
    try {
        const result = await axios.post(`${ip}/likeCheck`, {userId, place_id});

        console.log(result.data);
        return result.data;
    } catch(e) {
        return {result: false, msg: "util  =  " + e.message};
    };
};

export async function likeAdd(userId, place_id, check) { // 
    try {
        const result = await axios.post(`${ip}/likeAdd`, {userId, place_id, check});

        console.log(result.data);
        return result.data;
    } catch(e) {
        return {result: false, msg: "util  =  "+e.message};
    };
};

export async function likeList(userId) { // 
    try {
        const result = await axios.post(`${ip}/likeList`, {userId});
        return result.data;
    } catch(e) {
        return {result: false, msg: "util  =  "+e.message};
    };
};



export function createStaticMapURI(lat, lng) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=17&size=400x450&markers=color:0xEC9E81%7C${lat},${lng}&key=${GOOGLE_APP_KEY}`;
};

export async function getHospital(lat, lng) {
    // console.log(lat, lng);
    const uri = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=animal%20hospital&location=${lat}%2C${lng}&key=${GOOGLE_APP_KEY}&region=ko&rankby=distance&type=veterinary_care&language=ko`;

    const resp = await axios.get(uri);

    return (resp.data.results);
};

export async function getPetStore(lat, lng) {
    // console.log(lat, lng);
    const uri = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=animal&location=${lat}%2C${lng}&key=${GOOGLE_APP_KEY}&region=ko&rankby=distance&type=pet_store&language=ko`;

    const resp = await axios.get(uri);

    return (resp.data.results);
};

export async function getPark(lat, lng) {
    // console.log(lat, lng);
    const uri = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=공원&location=${lat}%2C${lng}&key=${GOOGLE_APP_KEY}&region=ko&rankby=distance&language=ko&type=park`;

    const resp = await axios.get(uri);

    return (resp.data.results);
};


export async function getPlaceInfo(place_id) {
    // console.log(place_id);
    let data = [];
    for(let i =0 ;i<place_id.length;i++){
        const one = place_id[i]
        const uri = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${one}&language=ko&reviews_sort=newest&key=${GOOGLE_APP_KEY}`;
        const resp = await axios.get(uri);
        // return resp.data.result
        data.push(resp.data.result)
    }
     
    // console.log("data",data)
    return data;

}
