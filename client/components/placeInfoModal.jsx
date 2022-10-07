import { useEffect, useState } from "react";
import { Image, ImageBackground, Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { createStaticMapURI, getPlaceInfo } from "../api/place";
import FontText from "../customs/fontText";
import Loading from "../customs/loading";

function Dist(lat1, lng1, lat2, lon2) {
    const rad = function (x) { return x * Math.PI / 180; };

    const R = 6378.137;
    const dLat = rad(lat2 - lat1);
    const dLong = rad(lon2 - lng1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d.toFixed(3);
};


function PlaceInfoModal({ visible, item_id, currentCoords, onCloseModal }) {
    const [distance, setDistance] = useState(null);
    const [mapURI, setMapURI] = useState("");
    const [moreInfo, setMoreInfo] = useState({})

        useEffect(() => {

            if (item_id) {
                !async function () {
                    try {
                        const itemInfo = await getPlaceInfo(item_id);
                        const { lat, lng } = itemInfo.geometry.location;
                        const resMapUri = createStaticMapURI(lat, lng);
                        
                        setMoreInfo(itemInfo);
                        setDistance(() => {
                            const otherLat = lat;
                            const otherLng = lng;

                            const Distancia = Dist(currentCoords.lat, currentCoords.lng, otherLat, otherLng);

                            return Distancia;
                        });
                        setMapURI(resMapUri);
                    } catch (e) {
                        console.log("PlaceInfoModal_useEffect===");
                        console.log(e.message);
                    };
                }();
            };

        }, [item_id, currentCoords])


    return (
        <Modal animationType="slide" visible={visible} transparent={true}>
            <Pressable onPress={() => onCloseModal()} style={styles.back}>
                <Pressable onPress={() => {}} style={styles.body} >
                    {mapURI ?
                        <ImageBackground source={{ uri: mapURI }} style={styles.mapImage}>
                            <View style={styles.mapTextBox}>
                                <FontText title={true} style={{ fontSize: 24 }}>{moreInfo?.name || "-"}</FontText>
                                <FontText bold={true} style={{ fontSize: 14, color: "gray" }}>{moreInfo?.formatted_address || "-"}</FontText>
                            </View>
                        </ImageBackground>
                        : <Loading />
                    }
                    <View style={styles.infoBox}>
                        <FontText style={{ fontSize: 13 }}>{ moreInfo?.international_phone_number ? "0" + String(moreInfo?.international_phone_number).split(" ")[1] :  "연락처가 존재하지 않습니다."}</FontText>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    back: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    body: {
        flex: 1,
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "white",
        height: 586,
        borderTopRightRadius: 32,
        borderTopLeftRadius: 32,
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden"
    },
    mapImage: {
        width: 400,
        height: 250,
        justifyContent: "flex-end"
    },
    mapTextBox: {
        padding: 8,
        backgroundColor: "rgba(255,255,255, 0.8)"
    },
    infoBox: {

    },
})

export default PlaceInfoModal;