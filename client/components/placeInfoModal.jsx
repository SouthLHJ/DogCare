import { useContext, useEffect, useState } from "react";
import { Alert, Image, ImageBackground, Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { createStaticMapURI, getPlaceInfo, likeAdd, sendLikeCheckRequest } from "../api/place";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import Loading from "../customs/loading";
import { AntDesign } from '@expo/vector-icons';

function Dist(lat1, lng1, lat2, lon2) {
    const rad = function (x) { return x * Math.PI / 180; };

    const R = 6378.137;
    const dLat = rad(lat2 - lat1);
    const dLong = rad(lon2 - lng1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;


    let fixed = d.toFixed(1);

    if(fixed.endsWith("0")) {
        fixed = fixed.split(".")[0];
    };

    return fixed;
};


function PlaceInfoModal({ visible, item_id, currentCoords, onCloseModal }) {
    const [distance, setDistance] = useState(null);
    const [mapURI, setMapURI] = useState("");
    const [likeCheck, setLikecheck] = useState(false);
    const [moreInfo, setMoreInfo] = useState({})
    const { auth } = useContext(AppContext);

    useEffect(() => {

        if (item_id) {
            !async function () {
                try {
                    const itemInfo = await getPlaceInfo(item_id);
                    const { lat, lng } = itemInfo.geometry.location;
                    const resMapUri = createStaticMapURI(lat, lng);
                    const isLiked = await sendLikeCheckRequest(auth.id, item_id);

                    console.log(isLiked);

                    setLikecheck(isLiked.check);
                    setMoreInfo(itemInfo);
                    setDistance(() => {
                        const otherLat = lat;
                        const otherLng = lng;

                        const Distancia = Dist(currentCoords.lat, currentCoords.lng, otherLat, otherLng);

                        return Distancia
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
            <Pressable onPress={() => {
                setMapURI(false);
                setMoreInfo({});
                setDistance(null);
                onCloseModal();
                }} style={styles.back}>
                <Pressable onPress={() => { }} style={styles.body} >
                    {mapURI ?
                        <ImageBackground source={{ uri: mapURI }} style={styles.mapImage}>
                            <View style={styles.mapBox}>
                            <View style={styles.mapTextBox}>
                                <FontText title={true} style={{ fontSize: 24 }}>{moreInfo?.name || "-"}</FontText>
                                <FontText bold={true} style={{ fontSize: 14, color: "gray" }}>{moreInfo?.formatted_address || "-"}</FontText>
                            </View>
                            <Pressable style={styles.mapLike} onPress={() => {
                                likeAdd(auth.id, item_id, likeCheck ? false : true)
                                .then((rcv) => {
                                    if(rcv.result) {
                                        setLikecheck(likeCheck ? false : true)
                                    } else {
                                        Alert.alert("" , rcv.msg);
                                    };
                                }).catch((err) => {
                                    Alert.alert("ERROR", "");
                                    console.log("likecheckError   ===   " + err.message);
                                });
                            }}>
                                {likeCheck ? 
                                <View >
                                    <AntDesign name="star" size={28} color="#F7C447" />
                                </View>
                                : <View >
                                    <AntDesign name="staro" size={28} color="gray" />
                                </View>
                                }
                            </Pressable>
                                </View>
                        </ImageBackground>
                        : <Loading />
                    }
                    <View style={styles.infoBox}>
                        <FontText style={{ fontSize: 13 }}>{moreInfo?.international_phone_number ? "0" + String(moreInfo?.international_phone_number).split(" ")[1] : "연락처가 존재하지 않습니다."}</FontText>
                        <FontText style={{ fontSize: 13 }}>{distance}km</FontText>
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
        width: 370,
        height: 250,
        justifyContent: "flex-end",
    },
    mapBox: {
        flexDirection: "row",
        padding: 8,
        backgroundColor: "rgba(255,255,255, 0.8)",
        alignContent: "space-between",
    },
    mapTextBox: {
    },
    mapLike: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
    },
    infoBox: {

    },
})

export default PlaceInfoModal;