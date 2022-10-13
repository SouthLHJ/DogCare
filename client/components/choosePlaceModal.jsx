import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { FontAwesome5, MaterialCommunityIcons, Entypo, AntDesign, MaterialIcons, Foundation } from '@expo/vector-icons';
import { useEffect } from "react";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus, requestForegroundPermissionsAsync } from 'expo-location'
import globalStyles, { colors } from "../customs/globalStyle";
import { getHospital, getPark, getPetStore } from "../api/place";

function ChoosePlaceModal({ category, visible, onCloseModal, setCategory, setList, setLoaded, setItemCoordinate, setCoordinate }) {
    const type = Platform.OS;
    const defaultH = type === "android" ? 73 : 103
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
        <Modal visible={visible} animationType="fade" transparent={true}>
            <Pressable style={{ flex: 1, flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" }} onPress={() => {
                onCloseModal();
            }}>
                <View style={[styles.modalButton, {bottom: defaultH, backgroundColor: colors.sub}]}>
                    <AntDesign name="caretdown" size={24} color="white" />
                </View>
                <Pressable style={[styles.modalButton, { bottom: defaultH+68, opacity: category === "hospital" ? 1 : .5 }]} onPress={() => {
                    setCategory("hospital");
                    setLoaded(true);
                        !async function () {
                            getFromLocation()
                                .then((res) => {
                                    console.log("res", res);
                                    getHospital(res.lat, res.lng)
                                        .then((resInner) => {
                                            setList(resInner);
                                            onCloseModal();
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
                        <FontAwesome5 name="hospital" size={24} color={colors.white} />
                </Pressable>
                <Pressable style={[styles.modalButton, { bottom: defaultH+136,  opacity: category === "store" ? 1 : .5 }]} onPress={() => {
                    setCategory("store");
                    setLoaded(true);
                        !async function () {
                            getFromLocation()
                                .then((res) => {
                                    console.log(res);
                                    getPetStore(res.lat, res.lng)
                                        .then((resInner) => {
                                            setList(resInner);
                                            onCloseModal();
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
                        <FontAwesome5 name="shopping-basket" size={22} color={colors.white} />
                </Pressable>
                <Pressable style={[styles.modalButton, { bottom: defaultH+204, opacity: category === "park" ? 1 : .5 }]} onPress={() => {
                        !async function () {
                            setLoaded(true);
                            setCategory("park");
                            getFromLocation()
                                .then((res) => {
                                    console.log(res);
                                    getPark(res.lat, res.lng)
                                        .then((resInner) => {
                                            setList(resInner);
                                            onCloseModal();
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
                        <Foundation name="guide-dog" size={32} color={colors.white} />
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalButton: {
        zIndex: 10000,
        position: 'absolute',
        right: 24,
        bottom: 0,
        borderRadius: 100,
        backgroundColor: colors.mid,
        elevation: 4,
        height: 56,
        width: 56,
        alignItems: "center",
        justifyContent: "center"
    },
})

export default ChoosePlaceModal;