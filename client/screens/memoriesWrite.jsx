import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Image, ImageBackground, ImageComponent, Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome, AntDesign } from '@expo/vector-icons';
import { launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, useMediaLibraryPermissions, PermissionStatus } from 'expo-image-picker';
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import Loading from "../customs/loading";
import globalStyles, { colors } from "../customs/globalStyle";
import DateTimePicker from '@react-native-community/datetimepicker';
import EyeIcon from "../components/eyeIcon";
import { editMemories, editMemoriesImage, writeMemories, writeMemoriesImage } from "../api/memories";
import { useIsFocused } from "@react-navigation/native";



function MemoriesWriteScreen({ navigation, route }) {
    const [loaded, setLoaded] = useState(false);
    const [date, setDate] = useState(new Date());
    const [title, setTitle] = useState(null);
    const [description, setDesc] = useState(null);
    const [isPublic, setPublic] = useState(false);
    const [imageData, setImageData] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [lastImageUri, setLastImageUri] = useState(null);
    const [dateShow, setDateShow] = useState(false);
    const [behavior, setBehavior] = useState("padding");
    const [cameraStatus, requestCameraPermission] = useCameraPermissions();
    const [albumStatus, requestAlbumPermission] = useMediaLibraryPermissions();
    const { auth } = useContext(AppContext);
    const isFocused = useIsFocused();
    const count = useRef(0);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    <TouchableOpacity onPressIn={()=>console.log(count.current)} onPress={(tt) => {
                        if(count.current > 0){
                            return;
                        }
                        count.current += 1;
                        setLoaded(true);

                        const data = {
                            token_id: auth.token,
                            date: date,
                            title: title,
                            description: description,
                            public: isPublic
                        };

                        console.log("loaded", loaded)

                        if (!(date && title && description)) {
                            setLoaded(false);
                            Alert.alert("", "????????? ????????? ???????????? ?????????????????? ?????????????????????.");
                            return;
                        } else if (route.params?.type) {
                            if (imageUri && imageData) {
                                editMemoriesImage(data, imageData, imageUri, lastImageUri, route.params.item._id)
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            console.log("??????!");
                                            count.current = 0;

                                            navigation.navigate("memoriesList");
                                        } else {
                                            console.log("editMemoriesImage ??????!", rcv.msg);
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });
                            } else {
                                editMemories(data, imageUri, route.params.item._id)
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            console.log("??????!");
                                            count.current = 0;
                                            navigation.navigate("memoriesList");
                                        } else {
                                            console.log("editMemories ??????!",rcv.msg);
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });
                            };
                        } else {
                            if (imageUri && imageData) {
                                writeMemoriesImage(data, imageData, imageUri)
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            console.log("??????!");
                                            count.current = 0;
                                            navigation.navigate("memoriesList");
                                        } else {
                                            console.log("writeMemoriesImage ??????!",rcv.msg);
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });
                            } else {
                                writeMemories(data)
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            console.log("??????!");
                                            count.current = 0;
                                            navigation.navigate("memoriesList");
                                        } else {
                                            console.log("writeMemories ??????!",rcv.msg);
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });
                            };
                        };
                        setLoaded(false);
                    }}>
                        <AntDesign name="checkcircleo" size={24} color={colors.mid} />
                    </TouchableOpacity>
                )
            },
            headerLeft: () => {
                return (
                    <Pressable onPress={() => {
                        navigation.navigate("memoriesList");
                    }}>
                        <AntDesign name="left" size={24} color={colors.mid} />
                    </Pressable>
                )
            }
        });
    }, [isFocused, title, description, imageData, imageUri, isPublic, loaded]);

    useEffect(() => {

        if (route.params?.type) {
            const currentItem = route.params.item;
            setDate(new Date(currentItem?.date));
            setTitle(currentItem?.title)
            setDesc(currentItem?.description)
            setPublic(currentItem?.public)
            setImageUri(currentItem?.image);
            setLastImageUri(currentItem?.image);
        } else {
            setTitle(null);
            setDesc(null);
            setImageData(null);
            setImageUri(null);
            setLastImageUri(null);
            setPublic(false);
        }

    }, [route.params, isFocused])


    const getFromCamera = async () => {
        if (cameraStatus.status == PermissionStatus.DENIED || cameraStatus.status == PermissionStatus.UNDETERMINED) {
            try {
                const cameraPermission = await requestCameraPermission();

                if (!cameraPermission.granted) {
                    Alert.alert("", '????????? ?????? ????????? ????????? ????????? ???????????? ??? ????????????.');
                    return;
                };
            } catch (e) {
                console.log(e.message);
                return;
            };
        };

        setLoaded(true);
        const result = await launchCameraAsync({ // ????????? ?????? ????????? ???????????? ???????????? ?????? ????????? ???. ????????? ?????? permission ????????? ??? ?????????
            quality: 0.4, // 0~1
            allowsEditing: true,
            aspect: [16, 9],
            base64: true,
        });

        if (!result.cancelled) { //????????? ???????????? ????????? ??????, uri??? ???????????? ????????????.
            setImageUri(result.uri);
            setImageData(result.base64);
        };
        setLoaded(false);
    };

    const getFromAlbum = async () => {
        if (albumStatus.status == PermissionStatus.DENIED || albumStatus.status == PermissionStatus.UNDETERMINED) {
            try {
                const albumPermission = await requestAlbumPermission();

                if (!albumPermission.granted) {
                    Alert.alert("", '?????? ?????? ????????? ????????? ????????? ???????????? ??? ????????????.');
                    return;
                };
            } catch (e) {
                console.log(e.message);
                return;
            };
        };

        setLoaded(true);
        const result = await launchImageLibraryAsync({
            quality: 0.4, // 0~1
            allowsEditing: true,
            aspect: [16, 9],
            exif: true, // ????????? ????????? ??????????????? ????????? ?????????
            base64: true,
        });

        if (!result.cancelled) {
            setImageUri(result.uri);
            setImageData(result.base64);
        };
        setLoaded(false);
    };

    return (
        <SafeAreaView>
            <KeyboardAvoidingView behavior={ Platform.OS === "ios" && behavior}>
                {loaded ? <Loading /> : <></>}
                <TouchableWithoutFeedback  onPress={Keyboard.dismiss} style={{ flex: 1 }}>
                    <View style={{ padding: 12, height: '100%' }}>

                        <View style={styles.inputBox}>
                        <ScrollView style={{ flex: 1 }}>
                            <View style={styles.headline}>
                                <TextInput style={[globalStyles.input, { flex: 1, borderRadius: 8, padding: 4, paddingHorizontal: 8 }]} onPressIn={() => setBehavior("padding")} placeholder="????????? ??????????????????." value={title} onChangeText={(text) => {
                                    setTitle(text);
                                }} />
                                {Platform.OS === "ios" ? <></>
                                    : <TouchableOpacity style={{ margin: 2, marginTop: 14 }} onPress={() => {
                                        setDateShow(true);
                                    }}>
                                        <FontText style={{ flex: 1, fontSize: 14, marginHorizontal: 4 }}>/ {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}</FontText>
                                    </TouchableOpacity>
                                }
                                {dateShow || Platform.OS === "ios" ?
                                    <DateTimePicker locale="ko" testID="dateTimePicker" value={date} mode="date" style={{ width: 100, marginLeft: 4 }} is24Hour={true} onChange={(d) => {
                                        if (d.type === "set") {
                                            setDate(new Date(d.nativeEvent.timestamp));
                                        };
                                        setDateShow(false);
                                        return;
                                    }} />
                                    : <></>
                                }
                            </View>
                            <View>
                                <View style={styles.imagePick}>
                                    <View style={styles.imageShow}>
                                        {imageUri ?
                                            <ImageBackground source={{ uri: imageUri }} style={{ height: "100%", width: "100%", borderRadius: 4, }} >
                                                <Pressable style={{ paddingHorizontal: 2 }} onPress={() => {
                                                    setImageData(null);
                                                    setImageUri(null);
                                                }}>
                                                    <FontAwesome name="remove" size={24} color={colors.semi} />
                                                </Pressable>
                                            </ImageBackground>
                                            : <FontText bold="semi" style={{ fontSize: 13 }}>????????? ?????? ??? ?????????.(??????)</FontText>
                                        }
                                    </View>
                                    <View style={styles.imageButtonBox}>
                                        <Pressable style={[styles.imageButton, { marginRight: 2 }]} onPress={() => {
                                            getFromCamera();
                                        }}>
                                            <MaterialIcons name="camera" size={24} color={colors.white} />
                                        </Pressable>
                                        <Pressable style={[styles.imageButton, { marginLeft: 2 }]} onPress={() => {
                                            getFromAlbum();
                                        }}>
                                            <MaterialIcons name="photo-library" size={24} color={colors.white} />
                                        </Pressable>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 12, width: "100%", marginVertical: 12 }} >
                                    <TextInput style={[globalStyles.input, { height: 186, borderRadius: 8, borderStyle: "dashed", padding: 4, paddingHorizontal: 8, width: "100%", textDecorationLine: "underline", textAlignVertical: "top", lineHeight: 26 }]} numberOfLines={8} multiline={true} placeholder="?????? ????????? ?????????????" value={description} onPressIn={() => setBehavior("position")} onChangeText={(text) => {
                                        setDesc(text);
                                    }} />
                                </View>

                                <View style={{ width: "100%", justifyContent: "flex-end", alignItems: "flex-end", paddingHorizontal: 8 }} >
                                    <EyeIcon isPublic={isPublic} onSetPublic={(changePublic) => {
                                        setPublic(changePublic);
                                    }} />
                                </View>
                            </View>
                        </ScrollView>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default MemoriesWriteScreen;

const styles = StyleSheet.create({
    headline: {
        marginBottom: 12,
        width: "100%",
        paddingHorizontal: 12,
        paddingVertical: 4,
        flexDirection: "row",
        alignItems: "center",
    },
    inputBox: {
        flex: 1,
        padding: 6,
        paddingTop: 14,
        backgroundColor: "white",
        borderRadius: 12,
        flexDirection: "column",
        alignContent: "center",
    },
    imagePick: {
        width: "100%",
        paddingHorizontal: 12,

    },
    imageButtonBox: {
        flexDirection: "row",
    },
    imageButton: {
        flex: 1,
        backgroundColor: colors.sub,
        marginVertical: 4,
        alignItems: "center",
        paddingVertical: 2,
        borderRadius: 4
    },
    imageShow: {
        height: 180,
        width: "100%",
        backgroundColor: colors.light,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
});