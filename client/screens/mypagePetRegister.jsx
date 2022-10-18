import { useContext, useEffect, useState } from "react";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Loading from "../customs/loading";
import { MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, useMediaLibraryPermissions, PermissionStatus } from 'expo-image-picker';
import FontText from "../customs/fontText";
import Checkbox from "react-native-bouncy-checkbox";
import CodeModal from "../components/codeModal";
import { AppContext } from "../contexts/app-context";
import { addDog, addDogImage, editDog, editDogImage } from "../api/dog";
import { useIsFocused } from "@react-navigation/native";
import { colors } from "../customs/globalStyle";

function MypagePetRegisterScreen({ navigation, route }) {
    const [loaded, setLoaded] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [lastFile, setLastFile] = useState(null);
    const [name, setName] = useState(null);
    const [birth, setBirth] = useState(new Date());
    const [gender, setGender] = useState(null);
    const [species, setSpecies] = useState(null);
    const [code, setCode] = useState(null);
    const [extra, setExtra] = useState(null);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [dateShow, setDateShow] = useState(false);
    const [behavior, setBehavior] = useState("padding");
    const [albumStatus, requestAlbumPermission] = useMediaLibraryPermissions();
    const isFocused = useIsFocused();
    const { auth } = useContext(AppContext);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    <Pressable onPress={() => {
                        if (!name) {
                            Alert.alert("", "이름은 필수입력요소 입니다.");
                            return;
                        };
                        const dogData = {
                            token_id: auth.token,
                            name: name,
                            birth: birth,
                            gender: gender,
                            animalCode: code,
                            extra: extra,
                            species: species
                        };
                        // console.log(dogData);

                        setLoaded(true);

                        if (route.params?.editMode) {
                            if (imageUri && imageData) {// 사진까지 수정
                                editDogImage(dogData, imageData, imageUri, lastFile)
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            navigation.navigate("mypageList");
                                        } else {
                                            console.log(rcv.msg);
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });

                            } else { // 사진 빼고 수정
                                editDog({...dogData, image: imageUri})
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            navigation.navigate("mypageList");
                                        } else {
                                            console.log(rcv.msg);
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });

                            };
                        } else {
                            if (imageUri && imageData) { // 사진까지 등록
                                console.log(imageUri )
                                addDogImage(dogData, imageData, imageUri)
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            navigation.navigate("mypageList");
                                        } else {
                                            console.log(rcv.msg);
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });
                            } else { // 사진 빼고 등록
                                addDog(dogData)
                                    .then((rcv) => {
                                        if (rcv.result) {
                                            navigation.navigate("mypageList");
                                        } else {
                                            console.log(rcv.msg);
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    });
                            };
                        };

                        setLoaded(false);
                    }}>
                        <AntDesign name="checkcircleo" size={24} color={colors.mid} />
                    </Pressable>
                )
            },
            headerLeft: () => {
                return (
                    <Pressable onPress={() => {
                        navigation.navigate("mypageList");
                    }}>
                        <AntDesign name="left" size={24} color={colors.mid} />
                    </Pressable>
                )
            }
        });
    }, [isFocused, name, birth, gender, species, extra, imageData, imageUri]);

    useEffect(() => {
        if (route.params?.editMode) {
            console.log("route", route.params)
            const { currentData } = route.params;

            setImageUri(currentData.image);
            setLastFile(currentData.image);
            setName(currentData.name);
            setBirth(new Date(currentData.birth));
            setGender(currentData.gender);
            setSpecies(currentData.species);
            setCode(currentData.animalCode);
            setExtra(currentData.extra);
        };
    }, [route.params, isFocused])


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
            quality: 0.4,
            allowsEditing: true,
            aspect: [16, 9],
            exif: true,
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

            <KeyboardAvoidingView behavior={Platform.OS === "ios" && behavior}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
                <View style={{height: "100%"}}>
                {loaded ? <Loading /> : <></>}
                    {showCodeModal ? <CodeModal visible={showCodeModal} setDatas={(datas) => {
                        setCode(datas.animalCode);
                        setGender(datas.gender);
                        setName(datas.name);
                        setSpecies(datas.species);
                    }} closeModal={() => setShowCodeModal(false)} /> : <></>}
                    <View style={styles.mainBox}>
                        <ScrollView>
                        <View style={styles.body}>
                            <View style={styles.imageBox}>
                                {imageUri ?
                                    <Pressable style={styles.image} onPress={() => getFromAlbum()}>
                                        <Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%" }} />
                                    </Pressable>
                                    : <Pressable style={[styles.image, { backgroundColor: colors.semi }]} onPress={() => getFromAlbum()}>
                                        <MaterialIcons name="photo-library" size={32} color="white" />
                                    </Pressable>}
                                <View style={styles.nameInputBox}>
                                    <TextInput placeholder="name" style={{ fontSize: 18, margin: 8, marginBottom: 2 }} onPress={() => setBehavior("padding")} value={name} onChangeText={(text) => {
                                        if (code) {
                                            return;
                                        } else {
                                            setName(text);
                                        }
                                    }} />
                                </View>
                                <View style={styles.inputList}>
                                    <FontText title={true} bold={true} style={styles.label}>등록번호</FontText>
                                    <View style={[styles.inputBox, { flexDirection: "row", alignItems: "center" }]} placeholder="code" onChangeText={(text) => setCode(text)}>
                                        <Text style={[styles.input, { flex: 1, marginRight: 4 }]}>{code ? code : " - "}</Text>
                                        <TouchableOpacity onPress={() => setShowCodeModal(true)}>
                                            <FontAwesome5 name="search" size={20} color="#555555" />
                                        </TouchableOpacity>
                                    </View>
                                    <FontText title={true} bold={true} style={styles.label}>생년월일</FontText>
                                    <View style={[styles.inputBox, { flexDirection: "row" }]}>
                                        <TouchableOpacity style={Platform.OS === "ios" ? { width: 100 } : [styles.input, { flex: 1, marginRight: 4 }]} disabled={code ? true : false} onPress={() => {
                                            setDateShow(true);
                                        }}>
                                            {Platform.OS === "ios" ? <></> : <FontText>{`${birth.getFullYear()}-${Number(birth.getMonth()) + 1}-${birth.getDate()}`}</FontText>}
                                            {dateShow || Platform.OS === "ios" ?
                                                <DateTimePicker accentColor={colors.sub} locale="ko" testID="dateTimePicker" value={birth} mode="date" is24Hour={true} onChange={(d) => {
                                                    if (d.type === "set") {
                                                        setBirth(new Date(d.nativeEvent.timestamp));
                                                    };
                                                    setDateShow(false);
                                                    return;
                                                }} />
                                                : <></>
                                            }

                                        </TouchableOpacity>
                                    </View>
                                    <FontText title={true} bold={true} style={styles.label}>성별</FontText>
                                    <View style={[styles.inputBox, { flexDirection: "row", justifyContent: "space-between" }]}>
                                        <View style={{ justifyContent: "space-between", height: 42 }}>
                                            <Checkbox fillColor={colors.sub} isChecked={gender === "male" ? true : false} disableBuiltInState={true} disabled={code ? true : false} size={18} textComponent={<FontText title={true} bold={true} style={{ marginLeft: 2 }}>수컷</FontText>} onPress={() => {
                                                if (gender == "male") {
                                                    setGender(null);
                                                } else {
                                                    setGender("male");
                                                };
                                            }} />
                                            <Checkbox fillColor={colors.sub} isChecked={gender === "_male" ? true : false} disableBuiltInState={true} disabled={code ? true : false} size={18} textComponent={<FontText title={true} bold={true} style={{ marginLeft: 2 }}>수컷(중성화)</FontText>} onPress={() => {
                                                if (gender == "_male") {
                                                    setGender(null);
                                                } else {
                                                    setGender("_male");
                                                };
                                            }} />
                                        </View>
                                        <View style={{ justifyContent: "space-between", height: 42 }}>
                                            <Checkbox fillColor={colors.sub} isChecked={gender === "female" ? true : false} disableBuiltInState={true} disabled={code ? true : false} size={18} textComponent={<FontText title={true} bold={true} style={{ marginLeft: 2 }}>암컷</FontText>} onPress={() => {
                                                if (gender == "female") {
                                                    setGender(null);
                                                } else {
                                                    setGender("female");
                                                };
                                            }} />
                                            <Checkbox fillColor={colors.sub} isChecked={gender === "_female" ? true : false} disableBuiltInState={true} disabled={code ? true : false} size={18} textComponent={<FontText title={true} bold={true} style={{ marginLeft: 2 }}>암컷(중성화)</FontText>} onPress={() => {
                                                if (gender == "_female") {
                                                    setGender(null);
                                                } else {
                                                    setGender("_female");
                                                };
                                            }} />
                                        </View>
                                        <View style={{ justifyContent: "space-between", height: 42 }}>
                                            <Checkbox fillColor={colors.sub} isChecked={gender === "unknown" ? true : false} disableBuiltInState={true} disabled={code ? true : false} size={18} textComponent={<FontText title={true} bold={true} style={{ marginLeft: 2 }}>모름</FontText>} onPress={() => {
                                                if (gender == "unknown") {
                                                    setGender(null);
                                                } else {
                                                    setGender("unknown");
                                                };
                                            }} />
                                        </View>
                                    </View>
                                    <FontText title={true} bold={true} style={styles.label}>품종</FontText>
                                    <View style={styles.inputBox}>
                                        <TextInput style={styles.input} placeholder="species" value={species} onPressIn={() => setBehavior("position")} onChangeText={(text) => {
                                            if (code) {
                                                return;
                                            } else {
                                                setSpecies(text);
                                            };
                                        }} />
                                    </View>
                                    <FontText title={true} bold={true} style={styles.label}>특이사항</FontText>
                                    <View style={styles.inputBox}>
                                        <TextInput style={styles.input} placeholder="special note" value={extra} onPressIn={() => setBehavior("position")} onChangeText={(text) => {
                                            setExtra(text);
                                        }} />
                                    </View>

                                </View>
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

export default MypagePetRegisterScreen;

const styles = StyleSheet.create({
    mainBox: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        margin: 12,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 8,
    },
    body: {
        flex: 1,
        width: "100%",
        flexDirection: "column",
    },
    imageBox: {
        alignContent: "center",
        alignItems: "center",
        margin: 12
    },
    image: {
        borderRadius: 100,
        height: 86,
        width: 86,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center"
    },
    nameInputBox: {
        borderBottomWidth: 2,
        borderBottomColor: colors.sub,
    },
    inputList: {
        width: 280,
        alignItems: "flex-start",
        marginTop: 18
    },
    label: {
        borderBottomWidth: 1,
        borderBottomColor: "#444444",
        fontSize: 15,
        margin: 4,
        marginTop: 12,
        color: "#444444"
    },
    inputBox: {
        width: "100%",
        marginVertical: 4
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "gray",
        padding: 6,
        paddingHorizontal: 8,
        height: 32,
        justifyContent: "center",
    },
});