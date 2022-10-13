import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Image, ImageBackground, Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { createStaticMapURI, getPlaceInfo, likeAdd, sendLikeCheckRequest } from "../api/place";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import Loading from "../customs/loading";
import { AntDesign } from '@expo/vector-icons';
import globalStyles from "../customs/globalStyle";
import PlaceReviewItem from "./placeReviewItem";

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
                    const itemInfo = await getPlaceInfo([item_id]);
                    const { lat, lng } = itemInfo[0].geometry.location;
                    const resMapUri = createStaticMapURI(lat, lng);
                    const isLiked = await sendLikeCheckRequest(auth.id, item_id);

                    setLikecheck(isLiked.check);
                    setMoreInfo(itemInfo[0]);
                    setDistance(() => {
                        const otherLat = lat;
                        const otherLng = lng;

                        const Distancia = Dist(currentCoords.lat, currentCoords.lng, otherLat, otherLng);


                        return Distancia
                    });
                    setMapURI(resMapUri);
                } catch (e) {
                    console.log("PlaceInfoModal_useEffect===",e.message);
                };
            }();
        };

    }, [item_id, currentCoords])

    // console.log(moreInfo);
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
                                <FontText title={true} bold={true} style={{ fontSize: 24 }}>{moreInfo?.name || "-"}</FontText>
                                <FontText bold={true} style={{ fontSize: 14, color: "gray", marginTop: 4 }}>{moreInfo?.formatted_address || "-"}</FontText>
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
                        <View style={styles.tableCellTitle}>
                            <FontText style={[globalStyles.textNomal, styles.textLabel]}>연락처</FontText>
                            <FontText style={[globalStyles.textNomal, styles.textLabel]}>거리</FontText>
                            <FontText style={[globalStyles.textNomal, styles.textLabel]}>웹사이트</FontText>
                        </View>
                        <View style={styles.tableCellContent}>
                            <FontText style={[globalStyles.textNomal, styles.textLabel]}>{moreInfo?.international_phone_number ? "0" + String(moreInfo?.international_phone_number).split(" ")[1] : "연락처가 존재하지 않습니다."}</FontText>
                            <FontText style={[globalStyles.textNomal, styles.textLabel]}>{distance}km</FontText>
                            <FontText style={[globalStyles.textNomal, styles.textLabel]}>{moreInfo?.website ? moreInfo?.website : "웹사이트가 존재하지 않습니다." }</FontText>
                        </View>

                    </View>
                    {moreInfo?.reviews ?
                    <View style={styles.reviewBox}>
                        <FlatList
                            data={moreInfo.reviews}
                            renderItem={({item})=>{
                                return (<PlaceReviewItem item={item}/>)
                            }}
                        />
                    </View> 
                    :
                    <FontText style={[globalStyles.textNomal, {marginTop: 18}]}>리뷰가 없습니다.</FontText>
                    }

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
        width: "100%",
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
        width : "100%",
        marginVertical: 6,
        flexDirection : "row",
        justifyContent : "space-around"
    },
    tableCell:{

    },
    tableCellContent:{

    },
    reviewBox :{
        width : "100%",
        flex : 1,
        marginTop: 8,
        paddingLeft: 8
    },
    textLabel: {
        marginBottom: 4
    }
})

export default PlaceInfoModal;