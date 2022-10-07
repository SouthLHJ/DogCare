import { ActivityIndicator, Image, ImageBackground, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Entypo, AntDesign, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus, requestForegroundPermissionsAsync } from 'expo-location'
import { useEffect, useState } from "react";
import { createStaticMapURI, getReverseGeocordingURI } from "../Screens/util/map";
import { useNavigation, useRoute } from "@react-navigation/native";

function AroundPlaceScreen() {

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