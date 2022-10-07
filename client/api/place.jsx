import axios from "axios";

const GOOGLE_APP_KEY = "AIzaSyAYhpmoUdICrtRsjJhBScxxR2cdY4gzpBM";

export function createStaticMapURI(lat, lng) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=800x450&markers=color:0xF1C65E%7C${lat},${lng}&key=${GOOGLE_APP_KEY}`;
};

export async function getReverseGeocordingURI(lat, lng) {
    const endPoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_APP_KEY}&language=ko`;

    const resp = await axios.get(endPoint);

    return resp.data;
};
