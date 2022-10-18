import { ActivityIndicator, Image, ImageBackground, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Entypo, AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { getHospital, getPark, getPetStore } from "../api/place";
import MapView, { Callout, Marker } from "react-native-maps";
import Loading from "../customs/loading";
import PlaceInfoModal from "../components/placeInfoModal";
import globalStyles, { colors } from "../customs/globalStyle";
import ChoosePlaceModal from "../components/choosePlaceModal";
import FontText from "../customs/fontText";




function AroundPlaceScreen({ navigation, route }) {
    const [loaded, setLoaded] = useState(false);
    const [coordinate, setCoordinate] = useState({ lat: 36, lng: 127, setting: false });
    const [itemcoordinate, setItemCoordinate] = useState({ lat: 36, lng: 127, setting: false });
    // const [mapURI, setMapURI] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showChooseModal, setShowChooseModal] = useState(false);
    const [list, setList] = useState([]);
    const [category, setCategory] = useState("");
    const [item, setItem] = useState({});


    useEffect(() => {
        navigation.setOptions({
            headerShown: true
        });

    })



    return (
        <View style={styles.container}>
            {loaded ? <Loading /> : <></>}
            <PlaceInfoModal currentCoords={coordinate} item_id={item?.place_id} visible={showModal} onCloseModal={() => {
                setItem({});
                setShowModal(false);
            }} />
            <ChoosePlaceModal visible={showChooseModal} category={category} setCategory={(value) => { setCategory(value) }} setList={(value) => { setList(value) }} setItemCoordinate={(value) => { setItemCoordinate(value) }} setCoordinate={(value) => { setCoordinate(value) }} setLoaded={(value) => setLoaded(value)} onCloseModal={() => {
                setShowChooseModal(false);
            }} />

            <View style={styles.containerInner}>
                <Pressable style={({ pressed }) => pressed ? [styles.modalButton, styles.modalButtonPress] : [styles.modalButton, { elevation: showChooseModal ? 0 : 4 }]} onPress={() => {
                    if (loaded) {
                        return;
                    };
                    setShowChooseModal(true);
                }}>
                    <AntDesign name="caretup" size={24} color="white" />
                </Pressable>
                <View style={styles.map}>
                    {itemcoordinate.setting ?
                        <MapView provider="google" mapType="terrain" showsUserLocation={true} region={{
                            latitude: itemcoordinate.lat,
                            longitude: itemcoordinate.lng,
                            latitudeDelta: 0.014,
                            longitudeDelta: 0.014,
                        }} style={{ flex: 1, width: "100%", height: "100%" }}>

                            {list.map((one, index) => {
                                return <Marker onCalloutPress={() => {
                                    setItemCoordinate({ lat: one.geometry.location.lat, lng: one.geometry.location.lng, setting: true });
                                    setItem(one);
                                    setShowModal(true);
                                }} coordinate={{ latitude: one.geometry.location.lat, longitude: one.geometry.location.lng }} key={one.place_id} title={one.name}>
                                    {Platform.OS === "ios" ?
                                        <Callout onPress={() => {
                                            setItemCoordinate({ lat: one.geometry.location.lat, lng: one.geometry.location.lng, setting: true });
                                            setItem(one);
                                            setShowModal(true);
                                        }} >
                                            <Text style={{ fontSize: 18, alignSelf: "center", marginVertical: 4 }}>
                                                {one.name}
                                            </Text>
                                        </Callout>
                                        : <></>}
                                </Marker>
                            })}
                        </MapView>
                        : <>
                        <FontText title={true} bold={true} style={{fontSize: 14}}>
                            어디로 갈까요?
                        </FontText>
                        <FontText title={true}  style={{fontSize: 14}}>
                            우측 하단의 버튼을 눌러 카테고리를 설정 해 주세요!
                        </FontText>
                        </>
                    }
                </View>
            </View>
        </View>
    );
}

export default AroundPlaceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%"
    },
    containerInner: {
        flex: 1,
        margin: 12,
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: 12,
        alignItems: "center",
        overflow: "hidden"
    },
    map: {
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonBox: {
        flex: 1,
        zIndex: 10000,
        position: 'absolute',
        right: 12,
        bottom: 12,
        flexDirection: "column",
        alignContent: "space-between",
    },
    button: {
        backgroundColor: colors.mid,
        height: 56,
        width: 56,
        borderRadius: 100,
        elevation: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    modalButton: {
        zIndex: 10000,
        position: 'absolute',
        right: 12,
        bottom: 12,
        borderRadius: 100,
        backgroundColor: colors.sub,
        elevation: 4,
        height: 56,
        width: 56,
        alignItems: "center",
        justifyContent: "center"
    },
    modalButtonPress: {
        elevation: 2,
        backgroundColor: "#E99E75"

    },
});