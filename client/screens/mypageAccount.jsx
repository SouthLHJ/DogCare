import { Ionicons,FontAwesome,MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';

import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { editUserProfile, readUserProfile } from '../api/account';
import { AppContext } from '../contexts/app-context';
import CustomDatePicker from '../customs/datePicker';
import FontText from '../customs/fontText';
import globalStyles from "../customs/globalStyle";
import Loading from '../customs/loading';

function MypageAccountScreen() {
    const navigation = useNavigation();
    const context = useContext(AppContext);

    const [pw,setPw] = useState(null);
    const [rePw,setRePw] = useState(null);
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState();
    const [contact, setContact] = useState();
    const [birth, setBirth] = useState(new Date());

    useEffect(()=>{
        onRefresh();
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
                text : "확인", onPress : ()=>onEdit()
            }]
        )
    }

    const onEdit = ()=>{
        // 비밀번호 양식 틀림
        if(!(/[a-zA-z0-9`~!@#$%^&*]{4,}/).test(pw)){
            return
        }
        // 비밀번호 재확인 틀림
        if(!(rePw === pw)){
            return 
        }
        const data = {
            birth: birth,
            contact: contact,
            name: name, 
            password: profile.password,
            place : profile.place
        }
        editUserProfile(context.auth.id,data)
            .then((rcv)=>{
                // console.log("??????",rcv);
                context.dispatch({type:"logout"})
                onRefresh();
            })
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

    let passwordAlarm = (<FontText></FontText>)
    if(pw){
        if(!(/[a-zA-z0-9`~!@#$%^&*]{4,}/).test(pw)){
            passwordAlarm = (<FontText style={[globalStyles.textAlarm,{fontSize : 10,textAlign :"right"}]}>영문자, 숫자, 특수문자(`~!@#$%^&*)만 사용 가능합니다.</FontText>)
        }
    }

    if(!profile){
        return(
            <Loading/>
        )
    }

    return (  
    <View style={globalStyles.container}>
        <View style={{flexDirection :"row", alignItems : "center" , justifyContent : "space-between"}}>
            <TouchableOpacity onPress={()=>moveBack()}>
                <Ionicons name="arrow-back" size={24} color="#0089FF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>onEditButton()}>
                <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
        </View>
        <View style={styles.userInfoContainer}>
            <View style={[styles.box,{alignItems : "center"}]}>
                <FontAwesome name="user-circle-o" size={60} color="black" />
            </View>
            <View style={styles.box}>
                <FontText>사용자 이름</FontText>
                <TextInput keyboardType='default' onChangeText={(text)=>setName(text)} value={name}/>
            </View>

            <FontText style={[globalStyles.textTitle]} bold={"semi"}>비밀번호</FontText>
            <TextInput  style={[globalStyles.input]}  onChangeText={(text)=>setPw(text)} secureTextEntry={true} autoCapitalize="sentences"
            value={pw} />
            {passwordAlarm}

            <FontText style={[globalStyles.textTitle]} bold={"semi"}>비밀번호 재확인</FontText>
            <TextInput  style={[globalStyles.input]}  onChangeText={(text)=>setRePw(text)} secureTextEntry={true} autoCapitalize="sentences"
            value={rePw} />
            { ( (rePw !== pw)&& rePw) ? <FontText style={[globalStyles.textAlarm,{fontSize : 10,textAlign :"right"}]}>비밀번호가 일치하지않습니다.</FontText> : <FontText></FontText>}

            <View style={styles.box}>
                <FontText>사용자 번호</FontText>
                <TextInput keyboardType='number-pad' onChangeText={(text)=>setContact(text)} value={`${contact}`}/>
            </View>
            <View style={styles.box}>
                <FontText>사용자 생년월일</FontText>
                <CustomDatePicker start={true} end={false} startPoint={birth} setStartPoint={setBirth}/>
            </View>
            
        </View>

    </View>
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