import { AntDesign,FontAwesome,MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';

import { Alert, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { editUserProfile, readUserProfile, sendLogin } from '../api/account';
import { AppContext } from '../contexts/app-context';
import CustomDatePicker from '../customs/datePicker';
import FontText from '../customs/fontText';
import globalStyles, { colors } from "../customs/globalStyle";
import Loading from '../customs/loading';

function MypageAccountScreen() {
    const navigation = useNavigation();
    const context = useContext(AppContext);

    const [profile, setProfile] = useState(null);
    const [name, setName] = useState();
    const [rePw,setRePw] = useState(null);
    const [contact, setContact] = useState();
    const [birth, setBirth] = useState(new Date());


    useEffect(()=>{
        onRefresh();
        navigation.setOptions({
            headerLeft: () => {
                return (
                    <Pressable onPress={() => {
                        moveBack()
                    }}>
                        <AntDesign name="left" size={24} color={colors.mid} />
                    </Pressable>
                )
            },
            headerRight : ()=>{
                return(
                    <Pressable onPress={() => {
                        onEditButton()
                    }}>
                        <AntDesign name="checkcircleo" size={24} color={colors.mid} />
                    </Pressable>
                )
            }
        });
    },[])

    //func
    const moveBack = ()=>{
        Alert.alert(
            "","수정하지않고 돌아가시겠습니까?",[{
                text : "취소"
            },{
                text : "확인" , onPress : ()=>navigation.navigate("mypageList")
            }]
        )
    }

    const onEditButton = ()=>{
        Alert.alert(
            "","프로필을 수정하시겠습니까? 자동 로그아웃됩니다.",[{
                text : "취소",
            },{
                text : "확인", onPress : ()=> {
                    if(rePw) {
                        onEdit()
                    } else {
                        Alert.alert("", "정보 수정을 위해서는 비밀번호 입력이 필요합니다.");
                    }
                }
            }]
        )
    }

    const onEdit = ()=>{
        // console.log(context.auth.id,rePw)
        sendLogin({id : context.auth.id,password :rePw})
        .then((rcv)=>{
            if(rcv.result){
                const data = {
                    birth: birth,
                    contact: contact,
                    name: name, 
                    password: profile.password,
                    place : profile.place
                }
                editUserProfile(context.auth.id,data)
                    .then((rcv)=>{
                        context.dispatch({type:"logout"})
                        onRefresh();
                    })
            }else{
                Alert.alert(
                    "",`정보 수정에 실패하였습니다. 비밀번호를 제대로 입력하지 않았거나 올바르지 않은 접근입니다.`
                )
            }
         })
         .catch(err=>console.log("mypageAccount Login =>", err))

        
    }

    const onRefresh = ()=>{
        readUserProfile(context.auth.id)
            .then((rcv)=>{
                // console.log(rcv)
                if(rcv.result){
                    setProfile(rcv.data);
                    setName(rcv.data.name);
                    setContact(rcv.data.contact);
                    setBirth(new Date(rcv.data?.birth ?? Date.now()));
                }else{
                    console.log("readUserProfile server => ",rcv.msg)
                }
            })
            .catch(err=>console.log("readUserProfile => ",err))
    }

    let contactAlarm = (<FontText></FontText>)
    if(contact){
        if(!(/^[0-1]{3}\d{3,4}\d{4}$/.test(contact))){
            contactAlarm = (<FontText style={[globalStyles.textAlarm,{fontSize : 10,textAlign :"right"}]}>전화번호 양식에 맞지않습니다.</FontText>)
        }
    }

    if(!profile){
        return(
            <Loading/>
        )
    }
    // console.log(profile,rePw)

    return (  
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
    <View style={[globalStyles.container, {borderTopRightRadius: 12, borderTopLeftRadius: 12, marginTop: 12}]}>
        <ScrollView>
        <View style={styles.userInfoContainer}>
            <View style={[styles.box,{alignItems : "center"}]}>
                <FontAwesome name="user-circle-o" size={60} color="black" />
            </View>

            <FontText style={[globalStyles.textNomal, globalStyles.label]} bold={"semi"}>닉네임</FontText>
            <TextInput  style={[globalStyles.input]} keyboardType='default' onChangeText={(text)=>setName(text)} value={name}/>
            <FontText></FontText>

            <FontText style={[globalStyles.textNomal, globalStyles.label]} bold={"semi"}>비밀번호 확인</FontText>
            <TextInput  style={[globalStyles.input]}  onChangeText={(text)=>setRePw(text)} secureTextEntry={true} autoCapitalize="sentences"
            value={rePw} />
            <FontText></FontText>

            <FontText style={[globalStyles.textNomal, globalStyles.label]} bold={"semi"}>사용자 번호</FontText>
            <TextInput style={[globalStyles.input]} keyboardType='number-pad' onChangeText={(text)=>{setContact(text);}} value={contact}/>
            {contactAlarm}

            <FontText style={[globalStyles.textNomal, globalStyles.label]} bold={"semi"}>사용자 생년월일</FontText>
            <View style={{paddingLeft : 4}}>
                <CustomDatePicker start={true} end={false} startPoint={birth} setStartPoint={setBirth} textStyle={{fontSize : 14}}/>
            </View>
            
        </View>

        </ScrollView>

    </View>
    </TouchableWithoutFeedback>
    );
}

export default MypageAccountScreen;

const styles = StyleSheet.create({
    userInfoContainer : {
        flex : 1,
        alignItems : "flex-start",
        paddingHorizontal : 20,

    },
    box : {
        marginVertical : 10,
        width : "100%",
    }
});