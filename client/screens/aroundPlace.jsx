import { ActivityIndicator, Image, ImageBackground, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Entypo, AntDesign, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus, requestForegroundPermissionsAsync } from 'expo-location'
import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createStaticMapURI } from "../api/place";

function AroundPlaceScreen() {
    const [loaded, setLoaded] = useState(false);
    const [mapURI, setMapURI] = useState(null);

    async function setMapInformation(getLat, getLng) { // 맵과 주소를 불러오는 함수

        setLoaded(true);

        try {
            const getMapURI = createStaticMapURI(getLat, getLng);

            getReverseGeocordingURI(getLat, getLng)
                .then((json) => {
                    onGetPlaceLoca(getLat, getLng, json.results[0].formatted_address);
                    setAddress(json.results[0].formatted_address);
                }).catch(e => {
                    console.log(e);
                });

                setMapURI(getMapURI);
                setLoaded(false);
            return;
        } catch (e) {
            console.log(e.message);
            setLoaded(false);
            return;
        };
    };

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
            setLoaded(false);
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
            await setMapInformation(res.coords.latitude, res.coords.longitude);
        } else {
            try {
                getCurrentPositionAsync()
                    .then(res => {
                        setMapInformation(res.coords.latitude, res.coords.longitude);
                    }).catch(e => {
                        console.log(e);
                    });
            } catch (e) {
                console.log(e.message);
                setLoaded(false);
                return;
            };
        }
    };




    return (  
    <View style={styles.container}>
        <View style={styles.containerInner}>

        <Text>around Place 페이지</Text>
        </View>
    </View>
    );
}

export default AroundPlaceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
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