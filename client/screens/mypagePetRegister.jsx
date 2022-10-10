import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Loading from "../customs/loading";
import { MaterialIcons } from '@expo/vector-icons';
import { launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, useMediaLibraryPermissions, PermissionStatus } from 'expo-image-picker';
import FontText from "../customs/fontText";

function MypagePetRegisterScreen({ navigation, route }) {
    const [loaded, setLoaded] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [name, setName] = useState(null);
    const [birth, setBirth] = useState(null);
    const [gender, setGender] = useState(null);
    const [species, setSpecies] = useState(null);
    const [code, setCode] = useState(null);
    const [albumStatus, requestAlbumPermission] = useMediaLibraryPermissions();

    useState(() => {
        if (route.params?.editMode) {
            const { currentData } = route.params;

            setImageUri(currentData.image);
            setName(currentData.name);
            setBirth(currentData.birth);
            setGender(currentData.gender);
            setSpecies(currentData.species);
            setCode(currentData.animalCode);
        }
    }, [route.params])


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
        <>
            {loaded ? <Loading /> : <></>}
            <View style={styles.mainBox}>
                <View style={styles.body}>
                    <View style={styles.imageBox}>
                        {imageUri ?
                            <Pressable style={styles.image} onPress={() => getFromAlbum()}>
                                <Image source={{ uri: imageUri }} style={{width: "100%", height: "100%"}}/>
                            </Pressable>
                            : <Pressable style={[styles.image, { backgroundColor: "gray" }]} onPress={() => getFromAlbum()}>
                                <MaterialIcons name="photo-library" size={24} color="white" />
                            </Pressable>}
                        <View style={styles.nameInputBox}>
                            <TextInput placeholder="name" onChangeText={(text) => setName(text)} />
                        </View>
                        <View style={styles.inputList}>
                            <TextInput style={styles.input} placeholder="birth" onChangeText={(text) => setBirth(text)} />
                            <TextInput style={styles.input} placeholder="gender" onChangeText={(text) => setGender(text)} />
                            <TextInput style={styles.input} placeholder="species" onChangeText={(text) => setSpecies(text)} />
                            <TextInput style={styles.input} placeholder="code" onChangeText={(text) => setCode(text)} />
                        </View>
                    </View>

                    <View>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("mypageList");
                        }}>
                            <FontText>취소</FontText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            if(name) {
                                Alert.alert("", "이름은 필수입력요소 입니다.");
                                return;
                            };

                            if(route.params.editMode) {
                                if(imageUri && imageData) {// 사진까지 수정
                                    
                                } else { // 사진 빼고 수정

                                };
                            } else {
                                if(imageUri && imageData) { // 사진까지 등록
                                    
                                } else { // 사진 빼고 등록

                                };
                            }
                        }}>
                            <FontText>확인</FontText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
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
        alignItems: "center"
    },
    image: {
        borderRadius: 100,
        height: 86,
        width: 86,
        overflow: "hidden"
    },
    nameInputBox: {
        borderBottomWidth: 1,
        borderBottomColor: "gray",
    },
    inputList: {

    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "gray",
    },
});