import { useContext, useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, useMediaLibraryPermissions, PermissionStatus } from 'expo-image-picker';
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import Loading from "../customs/loading";

function MemoriesRegisterScreen({ navigation, route }) {
    const [loaded, setLoaded] = useState(false);
    const [date, setDate] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDesc] = useState(null);
    const [isPublic, setPublic] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [cameraStatus, requestCameraPermission] = useCameraPermissions();
    const [albumStatus, requestAlbumPermission] = useMediaLibraryPermissions();
    const { auth } = useContext(AppContext);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    <View style={{ paddingHorizontal: 12 }}>
                        <Pressable onPress={() => {
                            navigation.navigate("memoriesList")
                        }}>
                            <Ionicons name="checkmark-circle-outline" size={24} color="black" />
                        </Pressable>
                    </View>
                )
            }, headerLeft: () => {
                return (
                    <View style={{ paddingHorizontal: 12 }}>
                        <Pressable onPress={() => {
                            if (!(date && title && description && isPublic)) {
                                Alert.alert("", "추억을 남기기 위해서는 필수요소들을 작성 해 주세요!")
                                return;
                            }

                            const data = {
                                token_id: auth.token,
                                date: date,
                                title: title,
                                description: description,
                                public: isPublic
                            };

                            setLoaded(true);

                            if (imageUri && imageData) {
                                writeMemoriesImage(data, imageData, imageUri)
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            console.log("저장!");
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
                                        } else {
                                            console.log("에러!");
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });
                            };

                            setLoaded(false);
                            navigation.navigate("memoriesList");
                        }}>
                            <Ionicons name="arrow-back-circle-outline" size={24} color="black" />
                        </Pressable>
                    </View>
                )
            }
        });
    });


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

        console.log(result.exif);
        if (!result.cancelled) {
            setImageUri(result.uri);
            setImageData(result.base64);
        };
        setLoaded(false);
    };


    return (
        <View style={{ flex: 1 }}>
            {loaded ? <Loading /> : <></>}
            <View style={styles.inputBox}>
                <View style={styles.headerRight}>
                    <Pressable onPress={() => {
                    }}>
                        <Ionicons name="checkmark-circle-outline" size={42} color="black" />
                    </Pressable>
                </View>
                <View style={styles.headerLeft}>
                    <Pressable onPress={() => {
                    }}>
                        <Ionicons name="arrow-back-circle-outline" size={42} color="black" />
                    </Pressable>
                </View>
                <TextInput />
                <View style={styles.imagePick}>
                    <View style={styles.imageShow}>
                        {imageUri ? 
                        <Image source={{uri: imageUri}} style={{height: "100%", width: "100%", borderRadius: 4,}} />
                        :<FontText>사진을 등록 해 주세요.(선택)</FontText>
                    }
                    </View>
                    <View style={styles.imageButtonBox}>
                        <Pressable style={[styles.imageButton, {marginRight: 2}]} onPress={() => {
                            getFromCamera();
                        }}>
                            <MaterialIcons name="camera" size={24} color="white" />
                        </Pressable>
                        <Pressable style={[styles.imageButton, {marginLeft: 2}]} onPress={() => {
                            getFromAlbum();
                        }}>
                            <MaterialIcons name="photo-library" size={24} color="white" />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default MemoriesRegisterScreen;

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
    inputBox: {
        flex: 1,
        margin: 12,
        padding: 8,
        paddingTop: 64,
        backgroundColor: "white",
        borderRadius: 12,
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center"
    },
    imagePick: {
        width: "100%",
        paddingHorizontal: 12
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