import { ActivityIndicator, Image, ImageBackground, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Entypo, AntDesign, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus, requestForegroundPermissionsAsync } from 'expo-location'
import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createStaticMapURI, getHospital, getPark, getReverseGeocordingURI } from "../api/place";
import MapView, { Marker } from "react-native-maps";
import Loading from "../customs/loading";
import PlaceInfoModal from "../components/placeInfoModal";

function AroundPlaceScreen({ navigation, route }) {
    const [loaded, setLoaded] = useState(false);
    const [coordinate, setCoordinate] = useState({ lat: 37.5318046, lng: 126.9141547 });
    const [mapURI, setMapURI] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [list, setList] = useState([]);
    const [item, setItem] = useState(null);
    const [locationStatus, requestLocationPermission] = useForegroundPermissions();



    // async function setMapInformation(getLat, getLng) { // 맵과 주소를 불러오는 함수

    //     setLoaded(true);

    //     try {
    //         const getMapURI = createStaticMapURI(getLat, getLng);

    //         getReverseGeocordingURI(getLat, getLng)
    //             .then((json) => {
    //                 onGetPlaceLoca(getLat, getLng, json.results[0].formatted_address);
    //                 setAddress(json.results[0].formatted_address);
    //             }).catch(e => {
    //                 console.log(e);
    //             });

    //         setMapURI(getMapURI);
    //         setLoaded(false);
    //         return;
    //     } catch (e) {
    //         console.log(e.message);
    //         setLoaded(false);
    //         return;
    //     };
    // };

    const verifyPermission = async () => { // 위치 추적 허용
        if (locationStatus.status == PermissionStatus.DENIED || locationStatus.status == PermissionStatus.UNDETERMINED) {
            const result = await requestForegroundPermissionsAsync();

            console.log(result);
            if (!result.granted) {
            };
        };
        return true;
    };

    const getFromLocation = async () => { // 현재 위치값을 가지고 데이터를 받아옴
        const permission = await verifyPermission();

        if (!permission) {
            return { permission: false }
        };

        setLoaded(true);


        if (Platform.OS === "android") {
            const res = {
                coords: {
                    latitude: 35.1619397111,
                    longitude: 126.851049769
                }
            };
            console.log("여기", res.coords)

            setCoordinate({ lat: res.coords.latitude, lng: res.coords.longitude });
            return { permission: true, lat: res.coords.latitude, lng: res.coords.longitude };
            // await setMapInformation(res.coords.latitude, res.coords.longitude);
        } else {
            try {
                const locationRes = await getCurrentPositionAsync();

                setCoordinate({ lat: locationRes.coords.latitude, lng: locationRes.coords.longitude });
                console.log("여기", locationRes.coords)
                return { permission: true, lat: locationRes.coords.latitude, lng: locationRes.coords.longitude };
            } catch (e) {
                console.log(e.message);
                return { permission: false };
            };
        }
    };


    return (
        <View style={styles.container}>
            {loaded ? <Loading /> : <></>}
            <PlaceInfoModal visible={showModal} />
            <View style={styles.containerInner}>

                <Text>around Place 페이지</Text>

                <Pressable onPress={() => {
                    !async function () {
                        getFromLocation()
                            .then((res) => {
                                console.log(res);
                                getHospital(res.lat, res.lng)
                                    .then((resInner) => {
                                        setList(resInner);
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
                    <Text>병원</Text>
                    <Text>병원</Text>
                    <Text>병원</Text>
                </Pressable>

                <Pressable onPress={() => {
                }}>
                    <Text>공원</Text>
                </Pressable>

                <View style={{ flex: 1, padding: 0, margin: 0 }}>
                    <MapView region={{
                        latitude: coordinate.lat,
                        longitude: coordinate.lng,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.006,
                    }} style={{ flex: 1 }}>

                        {list.map((one, index) => {
                            return <Marker onCalloutPress={() => {
                                setShowModal(true);
                                setItem(one);
                            }} coordinate={{ latitude: one.geometry.location.lat, longitude: one.geometry.location.lng }} key={index} title={one.name} />
                        })}
                    </MapView>
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
    },
});