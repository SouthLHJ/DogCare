import { useContext, useEffect, useState } from "react";
import { Alert, Image, ImageBackground, ImageComponent, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, useMediaLibraryPermissions, PermissionStatus } from 'expo-image-picker';
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import Loading from "../customs/loading";
import globalStyles from "../customs/globalStyle";
import DateTimePicker from '@react-native-community/datetimepicker';
import EyeIcon from "../components/eyeIcon";
import { editMemories, editMemoriesImage, writeMemories, writeMemoriesImage } from "../api/memories";



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
    const [cameraStatus, requestCameraPermission] = useCameraPermissions();
    const [albumStatus, requestAlbumPermission] = useMediaLibraryPermissions();
    const { auth } = useContext(AppContext);

    useEffect(() => {
        if (route.params?.type) {
            const currentItem = route.params.item;
            console.log(currentItem)
            setDate(new Date(currentItem?.date));
            setTitle(currentItem?.title)
            setDesc(currentItem?.description)
            setPublic(currentItem?.public)
            setImageUri(currentItem?.image);
            setLastImageUri(currentItem?.image);
        };
    }, [route.params]);

 
    const getFromCamera = async () => {
        if (cameraStatus.status == PermissionStatus.DENIED || cameraStatus.status == PermissionStatus.UNDETERMINED) {
            try {
                const cameraPermission = await requestCameraPermission();

                if (!cameraPermission.granted) {
                    Alert.alert("", '카메라 접근 권한이 없으면 기능을 사용하실 수 없습니다.');
                    return;
                };
            } catch (e) {
                console.log(e.message);
                return;
            };
        };

        setLoaded(true);
        const result = await launchCameraAsync({ // 카메라 이용 권한이 없는데도 실행되어 경고 로그가 뜸. 그래서 위의 permission 설정을 해 줘야함
            quality: 0.4, // 0~1
            allowsEditing: true,
            aspect: [16, 9],
            base64: true,
        });

        if (!result.cancelled) { //사진을 찍으려다 취소한 경우, uri가 들어가지 않도록함.
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
                    Alert.alert("", '앨범 접근 권한이 없으면 기능을 사용하실 수 없습니다.');
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
            exif: true, // 이미지 정보를 추가적으로 가져올 것인가
            base64: true,
        });

        if (!result.cancelled) {
            setImageUri(result.uri);
            setImageData(result.base64);
        };
        setLoaded(false);
    };

    const removeStates = () => {
        setTitle(null);
        setDesc(null);
        setImageData(null);
        setImageUri(null);
        setLastImageUri(null);
        setPublic(false);
    };

    return (
        <View style={{ flex: 1 }}>
            {loaded ? <Loading /> : <></>}
            <View style={styles.inputBox}>
                <View style={styles.headerRight}>
                    <Pressable onPress={() => {
                        const data = {
                            token_id: auth.token,
                            date: date,
                            title: title,
                            description: description,
                            public: isPublic
                        };
                        setLoaded(true);

                        if (!(date && title && description)) {
                            setLoaded(false);
                            Alert.alert("", "추억을 남기기 위해서는 필수요소들을 작성 해 주세요!");
                            return;
                        } else if (route.params?.type) {
                            if (imageUri && imageData) {
                                editMemoriesImage(data, imageData, imageUri, lastImageUri, route.params.item._id)
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            console.log("저장!");
                                            removeStates();
                                            navigation.navigate("memoriesList");
                                        } else {
                                            console.log("에러!");
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });
                            } else {
                                editMemories(data, imageUri, route.params.item._id)
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            console.log("저장!");
                                            removeStates();
                                            navigation.navigate("memoriesList");
                                        } else {
                                            console.log("에러!");
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });
                            };
                        }else {
                            if (imageUri && imageData) {    
                                writeMemoriesImage(data, imageData, imageUri)
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            console.log("저장!");
                                            removeStates();
                                            navigation.navigate("memoriesList");
                                        } else {
                                            console.log("에러!");
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });
                            } else {
                                writeMemories(data)
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            console.log("저장!");
                                            removeStates();
                                            navigation.navigate("memoriesList");
                                        } else {
                                            console.log("에러!");
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });
                            };
                        };

                        setLoaded(false);
                    }}>
                        <Ionicons name="checkmark-circle-outline" size={42} color="black" />
                    </Pressable>
                </View>
                <View style={styles.headerLeft}>
                    <Pressable onPress={() => {
                        removeStates();
                        navigation.navigate("memoriesList");
                    }}>
                        <Ionicons name="arrow-back-circle-outline" size={42} color="black" />
                    </Pressable>
                </View>
                <View style={styles.headline}>
                    <TextInput style={[globalStyles.input, { borderRadius: 8, padding: 4, paddingHorizontal: 8 }]} placeholder="제목을 입력해주세요." value={title} onChangeText={(text) => {
                        setTitle(text);
                    }} />
                    <View>
                        <FontText style={{ flex: 1, fontSize: 16, marginHorizontal: 4, marginVertical: 6 }}>{date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}</FontText>
                        {dateShow ?
                            <DateTimePicker locale="ko" testID="dateTimePicker" value={date} mode="date" is24Hour={true} onChange={(d) => {
                                if (d.type === "set") {
                                    setDate(new Date(d.nativeEvent.timestamp));
                                };
                                setDateShow(false);
                                return;
                            }} />
                            : <></>
                        }
                    </View>
                    <TouchableOpacity onPress={() => {
                        if (dateShow) {
                            setDateShow(false);
                        } else {
                            setDateShow(true);
                        }
                    }}>
                        <FontAwesome5 name="calendar-alt" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.imagePick}>
                    <View style={styles.imageShow}>
                        {imageUri ?
                            <ImageBackground source={{ uri: imageUri }} style={{ height: "100%", width: "100%", borderRadius: 4, }} >
                                <Pressable style={{ flex: 1 }} onPress={() => {
                                    setImageData(null);
                                    setImageUri(null);
                                }}>
                                    <FontAwesome name="remove" size={24} color="gray" />
                                </Pressable>
                            </ImageBackground>
                            : <FontText>사진을 등록 해 주세요.(선택)</FontText>
                        }
                    </View>
                    <View style={styles.imageButtonBox}>
                        <Pressable style={[styles.imageButton, { marginRight: 2 }]} onPress={() => {
                            getFromCamera();
                        }}>
                            <MaterialIcons name="camera" size={24} color="white" />
                        </Pressable>
                        <Pressable style={[styles.imageButton, { marginLeft: 2 }]} onPress={() => {
                            getFromAlbum();
                        }}>
                            <MaterialIcons name="photo-library" size={24} color="white" />
                        </Pressable>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 12, width: "100%", marginVertical: 12 }} >
                    <TextInput style={[globalStyles.input, { borderRadius: 8, borderStyle: "dashed", padding: 4, paddingHorizontal: 8, width: "100%", textDecorationLine: "underline", textAlignVertical: "top", lineHeight: 26 }]} numberOfLines={8} multiline={true} placeholder="어떤 일들이 있었나요?" value={description} onChangeText={(text) => {
                        setDesc(text);
                    }} />
                </View>

                <View style={{ flex: 1, width: "100%", justifyContent: "flex-end", alignItems: "flex-end" }} >
                    <EyeIcon isPublic={isPublic} onSetPublic={(changePublic) => {
                        setPublic(changePublic);
                    }} />
                </View>
            </View>
        </View>
    );
}

export default MemoriesWriteScreen;

const styles = StyleSheet.create({
    headerRight: {
        zIndex: 10000,
        position: 'absolute',
        right: 12,
        top: 0,
        padding: 12,
    },
    headerLeft: {
        zIndex: 10000,
        position: 'absolute',
        left: 12,
        top: 0,
        padding: 12,
    },
    headline: {
        marginBottom: 12,
        marginTop: 42,
        width: "100%",
        paddingHorizontal: 12,
        paddingVertical: 4,
        flexDirection: "row"
    },
    inputBox: {
        flex: 1,
        margin: 12,
        padding: 8,
        paddingTop: 16,
        backgroundColor: "white",
        borderRadius: 12,
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center"
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
        backgroundColor: "#0089FF",
        marginVertical: 4,
        alignItems: "center",
        paddingVertical: 2,
        borderRadius: 4
    },
    imageShow: {
        height: 180,
        width: "100%",
        backgroundColor: "#DDDDDD",
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center"
    },
});