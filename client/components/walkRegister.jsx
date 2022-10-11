import DateTimePicker from '@react-native-community/datetimepicker';

import { useNavigation } from '@react-navigation/native';
import { MaterialIcons,AntDesign, FontAwesome } from '@expo/vector-icons';
import { launchImageLibraryAsync, useMediaLibraryPermissions, PermissionStatus } from 'expo-image-picker';
import { useContext, useEffect, useState } from 'react';
import { ImageBackground,  Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View, Keyboard, Alert } from "react-native";
import FontText from "../customs/fontText";
import Loading from '../customs/loading';
import globalStyles from '../customs/globalStyle';
import CustomButton from '../customs/customButton';
import { AppContext } from '../contexts/app-context';
import { editWalk, writeWalk, writeWalkImage } from '../api/walk';

function WalkRegister({modal,setModal,time1,time2, image , memo , edit=false, id}) {
    const context = useContext(AppContext);
    const navigation  = useNavigation();

    const [albumStatus, requestAlbumPermission] = useMediaLibraryPermissions();
    const [hide, setHide] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const [imageUri, setImageUri] = useState(image ?? null);
    const [imageData, setImageData] = useState(null);
    const [dateShow, setDateShow] =useState(false);
    const [date, setDate] = useState(new Date());
    const [comment, setComment] = useState(memo ?? null);

    useEffect(()=>{

    },[])
    //func
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

    const onRegister = ()=>{
        const data = {
            date: date,
            time1: time1,
            time2 : time2,
            memo: comment ?? ""
        };
        setLoaded(true);
        if(!edit){
            if (imageUri && imageData) {
                console.log("no edit, image")    
                writeWalkImage(context.auth.token,data, imageData, imageUri)
                    .then((rcv) => {
                        if (rcv.result) {
                            setModal(false)
                            navigation.navigate("walkList",{refresh : true});
                        } else {
                            console.log("writeWalkImage server => ", rcv.msg);
                        };
                    }).catch((err) => {
                        console.log("writeWalkImage = > ",err.message);
                    });
            }else {
                console.log("no edit, no image")    
                writeWalk(context.auth.token,data)
                    .then((rcv) => {
                        if (rcv.result) {
                            setModal(false)
                            navigation.navigate("walkList",{refresh : true});
                        } else {
                            console.log("writeWalk server =>", rcv.msg);
                        };
                    }).catch((err) => {
                        console.log("writeWalk = > ",err.message);
                    });
            };
        }else{
            console.log("edit")    
            editWalk(context.auth.token,data,imageData,imageUri,id)
                .then((rcv)=>{
                    if(rcv.result){
                        setModal(false)
                        navigation.navigate("walkList",{edit : true});
                    }else{
                        console.log("editWalk server =>",rcv.msg);
                    }
                }).catch(err=>console.log("editWalk => ", err.message))
                
        }

        setLoaded(false);
    }

    const onCloseModal = ()=>{
        if(!edit){
            Alert.alert(
                "","산책기록을 저장하시겠습니까?",[
                {
                    text : "취소",
                },{
                    text : "삭제", onPress : ()=>setModal(false)
                },{
                    text : "저장", onPress : ()=>{onRegister()}
                }]
            )
        }else{
            Alert.alert(
                "","수정한 내용을 저장하시겠습니까?",[
                {
                    text : "취소"
                },{
                    text : "안함", onPress : ()=>setModal(false)
                },{
                    text : "저장", onPress : ()=>{onRegister()}
                }]
            )
        }
    }

    // 키보드 유무 체크
    Keyboard.addListener("keyboardDidShow", ()=> setHide(true))
    Keyboard.addListener("keyboardDidHide", ()=> setHide(false))


    if(loaded){
        return (
            <Loading/>
        )
    }

    return (  
        <Modal
            animationType="slide"
            transparent={true}
            visible={modal}
        >
           <View style={styles.area}>
                <View style={styles.container}>
                    <View style={styles.topContainer}>
                        <View style={styles.topTitle}> 
                            <FontText>기록</FontText>
                        </View>
                        <TouchableOpacity style={styles.topClose} onPress={()=>onCloseModal()}>
                            <AntDesign name="closesquare" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View  style={styles.bodyContainer}>
                        {hide ?
                        <></>
                        :
                        <>
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
                                <Pressable style={[styles.imageButton, { marginLeft: 2 }]} onPress={() => {
                                    getFromAlbum();
                                }}>
                                    <MaterialIcons name="photo-library" size={24} color="white" />
                                </Pressable>
                            </View>
                            <View style={{flexDirection: "row", justifyContent : "space-around"}}>
                                <View style={{alignItems : "flex-start"}}>
                                    <FontText>날짜 </FontText>
                                    <FontText>산책 시작</FontText>
                                    <FontText>산책 종료</FontText>
                                    <FontText>총 시간</FontText>
                                </View>
                                <View style={{alignItems : "center"}}>
                                    <Pressable onPress={()=>setDateShow(!dateShow)}>
                                        <FontText>{date.getFullYear()} - {date.getMonth()+1} - {date.getDate()}</FontText>
                                    </Pressable>
                                    {dateShow && <DateTimePicker locale="ko" testID="dateTimePicker" value={date} mode="date" is24Hour={true} onChange={(d)=>{
                                        if(d.type === "set"){setDate(new Date(d.nativeEvent.timestamp)); } setDateShow(false);
                                    }} />}
                                    <FontText>{new Date(time1).getHours()}시 {new Date(time1).getMinutes()}분 {new Date(time1).getSeconds()}초</FontText>
                                    <FontText>{new Date(time2).getHours()}시 {new Date(time2).getMinutes()}분 {new Date(time2).getSeconds()}초</FontText>
                                    <FontText>{((time2-time1)/(1000*60*60)).toFixed(0)}시간 {((time2-time1)/(1000*60)).toFixed(0)}분 {((time2-time1)/(1000)).toFixed(0)}초</FontText>
                                </View>

                            </View>
                        </>
                        }
                    </View>
                    <View style={{paddingHorizontal : 3 }}>
                        <View style={{ paddingHorizontal: 5, width: "100%", marginVertical: 10 ,height : 80, justifyContent : "flex-end"}} >
                            <TextInput style={[globalStyles.input,styles.commentText]} onChangeText={(text)=>setComment(text)} value={comment}  multiline={true} placeholder="산책 기록에 남기고 싶은 내용을 적어보세요"/>
                        </View>
                        <CustomButton onPress={()=>onRegister()}>기록하기</CustomButton>        
                    </View>
                </View>
           </View>
        </Modal>
    );
}

export default WalkRegister;

const styles = StyleSheet.create({
    area : {flex:1, justifyContent :"flex-end"},
    container : {height : "70%", backgroundColor : "white", borderTopRightRadius : 15 , borderTopLeftRadius : 15 , borderWidth: 1, overflow : "hidden" },
    topContainer :{
        height  : 50,
        flexDirection : "row",
        alignItems :"center",
        borderBottomWidth : 1
    },
    topTitle : {flex:1,marginRight : -50, alignItems :"center"},
    topClose: {width : 50, alignItems : "center"},

    bodyContainer:{
        paddingHorizontal : 4
    },
    imageButtonBox: {
        flexDirection: "row",
    },
    imageButton: {
        flex: 2,
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
    commentText : { 
        flex  : 1,
        borderRadius: 8, 
        borderStyle: "dashed", 
        padding: 4, 
        paddingHorizontal: 8, 
        width: "100%", 
        textDecorationLine: "underline", 
        textAlignVertical: "top", 
        lineHeight: 26 
    }
});