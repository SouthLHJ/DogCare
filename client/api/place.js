import axios from "axios";

const GOOGLE_APP_KEY = "AIzaSyAYhpmoUdICrtRsjJhBScxxR2cdY4gzpBM";

export function createStaticMapURI(lat, lng) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=17&size=400x450&markers=color:0x0089FF%7C${lat},${lng}&key=${GOOGLE_APP_KEY}`;
};

export async function getHospital(lat, lng) {
    console.log(lat, lng);
    const uri = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=animal%20hospital&location=${lat}%2C${lng}&key=${GOOGLE_APP_KEY}&region=ko&rankby=distance&type=veterinary_care&language=ko`;

    const resp = await axios.get(uri);

    return (resp.data.results);
};

export async function getPetStore(lat, lng) {
    console.log(lat, lng);
    const uri = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=animal&location=${lat}%2C${lng}&key=${GOOGLE_APP_KEY}&region=ko&rankby=distance&type=pet_store&language=ko`;

    const resp = await axios.get(uri);

    return (resp.data.results);
};

export async function getPark(lat, lng) {
    console.log(lat, lng);
    const uri = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=공원&location=${lat}%2C${lng}&key=${GOOGLE_APP_KEY}&region=ko&rankby=distance&language=ko&type=park`;

    const resp = await axios.get(uri);

    return (resp.data.results);
};


export async function getPlaceInfo(place_id) {
    console.log(place_id);

    const uri = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&language=ko&reviews_sort=newest&key=${GOOGLE_APP_KEY}`;

    const resp = await axios.get(uri);

    return resp.data.result
}
