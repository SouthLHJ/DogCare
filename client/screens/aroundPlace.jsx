import { ActivityIndicator, Image, ImageBackground, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Entypo, AntDesign, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons,Foundation, FontAwesome5 } from '@expo/vector-icons';
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus, requestForegroundPermissionsAsync } from 'expo-location'
import { useEffect, useState } from "react";
import { getHospital, getPark, getPetStore } from "../api/place";
import MapView, { Marker } from "react-native-maps";
import Loading from "../customs/loading";
import PlaceInfoModal from "../components/placeInfoModal";
import globalStyles from "../customs/globalStyle";




function AroundPlaceScreen({ navigation, route }) {
    const [loaded, setLoaded] = useState(false);
    const [coordinate, setCoordinate] = useState({ lat: 36, lng: 127, setting: false });
    const [itemcoordinate, setItemCoordinate] = useState({ lat: 36, lng: 127, setting: false });
    // const [mapURI, setMapURI] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [list, setList] = useState([]);
    const [category, setCategory] = useState("");
    const [item, setItem] = useState({});
    const [locationStatus, requestLocationPermission] = useForegroundPermissions();


    const verifyPermission = async () => {
        console.log("locationStatus", locationStatus);
        if (locationStatus === null) {
            return false;
        } else if (locationStatus.status == PermissionStatus.DENIED || locationStatus.status == PermissionStatus.UNDETERMINED) {
            const result = await requestForegroundPermissionsAsync();

            if (!result.granted) {
                return false;
            };
        }
        return true;
    };

    const getFromLocation = async () => { // 현재 위치값을 가지고 데이터를 받아옴
        const permmision = await verifyPermission();

        if (!permmision) {
            return;
        }
        setLoaded(true);


        if (Platform.OS === "android") {
            const res = {
                coords: {
                    latitude: 35.1619397111,
                    longitude: 126.851049769
                }
            };
            console.log("여기", res.coords)

            setItemCoordinate({ lat: res.coords.latitude, lng: res.coords.longitude, setting: true });
            setCoordinate({ lat: res.coords.latitude, lng: res.coords.longitude, setting: true });
            return { lat: res.coords.latitude, lng: res.coords.longitude, setting: true };
            // await setMapInformation(res.coords.latitude, res.coords.longitude);
        } else {
            try {
                const locationRes = await getCurrentPositionAsync();

                setItemCoordinate({ lat: locationRes.coords.latitude, lng: locationRes.coords.longitude , setting: true});
                setCoordinate({ lat: locationRes.coords.latitude, lng: locationRes.coords.longitude , setting: true});
                console.log("여기", locationRes.coords)
                return { lat: locationRes.coords.latitude, lng: locationRes.coords.longitude, setting: true };
            } catch (e) {
                console.log(e.message);
                return { setting: false };
            };
        }
    };


    return (
        <View style={styles.container}>
            {loaded ? <Loading /> : <></>}
            <PlaceInfoModal currentCoords={coordinate} item_id={item?.place_id} visible={showModal} onCloseModal={() => {
                setItem({});
                setShowModal(false);
            }} />
            <View style={styles.containerInner}>

                <View style={styles.buttonBox}>
                    <Pressable style={[globalStyles.button, styles.button]} onPress={() => {
                        !async function () {
                            getFromLocation()
                                .then((res) => {
                                    console.log("res", res);
                                    getHospital(res.lat, res.lng)
                                        .then((resInner) => {
                                            setList(resInner);
                                            setCategory("hospital")
                                        }).catch((err) => {
                                            console.log(err.message);
                                        })
                                }).catch((err) => {
                                    console.log(err.message);
                                }).finally(() => {
                                    setLoaded(false);
                                });
                        }();
                    }}>
                        <FontAwesome5 name="hospital" size={28} color={category === "hospital" ? "white" : "#98CFFE"} />
                    </Pressable>

                    <Pressable style={[globalStyles.button, styles.button]} onPress={() => {
                        !async function () {
                            getFromLocation()
                                .then((res) => {
                                    console.log(res);
                                    getPetStore(res.lat, res.lng)
                                        .then((resInner) => {
                                            setList(resInner);
                                            setCategory("store")
                                        }).catch((err) => {
                                            console.log(err.message);
                                        })
                                }).catch((err) => {
                                    console.log(err.message);
                                }).finally(() => {
                                    setLoaded(false);
                                });
                        }();
                    }}>
                        <FontAwesome5 name="shopping-basket" size={26} color={category === "store" ? "white" : "#98CFFE"} />
                    </Pressable>

                    <Pressable style={[globalStyles.button, styles.button]} onPress={() => {
                        !async function () {
                            getFromLocation()
                                .then((res) => {
                                    console.log(res);
                                    getPark(res.lat, res.lng)
                                        .then((resInner) => {
                                            setList(resInner);
                                            setCategory("park");
                                        }).catch((err) => {
                                            console.log(err.message);
                                        })
                                }).catch((err) => {
                                    console.log(err.message);
                                }).finally(() => {
                                    setLoaded(false);
                                });
                        }();
                    }}>
                        <Foundation name="guide-dog" size={38} color={category === "park" ? "white" : "#98CFFE"} />
                    </Pressable>
                </View>

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
                                    setItemCoordinate({ lat:  one.geometry.location.lat, lng: one.geometry.location.lng, setting: true });
                                    setItem(one);
                                    setShowModal(true);
                                }} coordinate={{ latitude: one.geometry.location.lat, longitude: one.geometry.location.lng }} key={one.place_id} title={one.name} />
                            })}
                        </MapView>
                        : <></>
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
        padding: 12,
        margin: 12,
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: 12,
        alignItems: "center"
    },
    map: {
        height: "100%",
        width: "100%"
    },
    buttonBox: {
        flex: 1,
        zIndex: 10000,
        position: 'absolute',
        flexDirection: "row",
        alignContent: "space-between",
    },
    button: {
        height: 56,
        width: 56,
        borderRadius: 100,
        elevation: 4,
        margin: 32,
        justifyContent: "center",
        alignItems: "center"
    }
});