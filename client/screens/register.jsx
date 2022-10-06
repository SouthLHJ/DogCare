import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CustomButton from "../customs/customButton";
import FontText from "../customs/fontText";
import globalStyles from "../customs/globalStyle";

import DateTimePicker from '@react-native-community/datetimepicker';
import { sendRegister } from "../api/account";

function RegisterScreen() {
    const [id,setId] = useState(null);
    const [pw,setPw] = useState(null);
    const [rePw,setRePw] = useState(null);
    const [nick,setNick] = useState(null);
    const [date, setDate] = useState(new Date());
    const [dateShow, setDateShow] =useState(false);
    const [contact,setContact] = useState(null);


    const navigation = useNavigation();

    //func
    const moveLogin = ()=>{
        navigation.navigate("login");
    }
    const onRegister = ()=>{
        if(!(rePw === pw)){
            return 
        }
        if(!(id && pw && nick && contact)  ){
            Alert.alert(
                "", "아이디, 비밀번호, 이름, 전화번호 작성은 필수입니다.",[{
                    text : "확인"
                }]
            )
        }else{
            const data = {
                id : id,
                password : pw,
                name : nick,
                birth : date,
                contact : contact
            }
            // console.log(data)
            sendRegister(data)
             .then((rcv)=>{
                if(rcv.result){
                    Alert.alert(
                        "성공", "가입에 성공하셨습니다.",[{
                            text : "확인", onPress : ()=>{setId(null); setPw(null); setRePw(null); setChkPw(false); setNick(null); setDate(new Date()); setContact(null)}
                        }]
                    )
                }else{
                    Alert.alert(
                        "실패", "가입에 실패하셨습니다. 다시 시도해 주세요",[{
                            text : "확인", onPress : ()=>{setId(null); setPw(null); setRePw(null); setChkPw(false); setNick(null); setDate(new Date()); setContact(null)}
                        }]
                    )
                }
             })
             .catch((err)=>{
                console.log(err)
             })
        }
    }

    return (  
    <View style={globalStyles.container}>
        <View style={styles.inputContain}>
            <FontText style={[globalStyles.textNomal]}>아이디</FontText>
            <TextInput  style={[globalStyles.input,styles.input]}  onChangeText={(text)=>setId(text)}
            value={id}   keyboardType="email-address"/>

            <FontText style={[globalStyles.textNomal]}>비밀번호</FontText>
            <TextInput  style={[globalStyles.input,styles.input]}  onChangeText={(text)=>setPw(text)} secureTextEntry={true} autoCapitalize="sentences"
            value={pw} />

            <FontText style={[globalStyles.textNomal]}>비밀번호 재확인</FontText>
            <TextInput  style={[globalStyles.input,styles.input]}  onChangeText={(text)=>setRePw(text)} secureTextEntry={true} autoCapitalize="sentences"
            value={rePw} />

            <FontText style={[globalStyles.textNomal]}>닉네임</FontText>
            <TextInput  style={[globalStyles.input,styles.input]}  onChangeText={(text)=>setNick(text)}
            value={nick}   keyboardType="email-address"/>

            <FontText style={[globalStyles.textNomal]}>생년월일</FontText>
                <FontText>{date.getFullYear()} - {date.getMonth()+1} - {date.getDate()}</FontText>
                {dateShow && <DateTimePicker locale="ko" testID="dateTimePicker" value={date} mode="date" is24Hour={true} onChange={(d)=>{
                    if(d.type === "set"){setDate(new Date(d.nativeEvent.timestamp)); setDateShow(false);}
                }} />}
            <TouchableOpacity onPress={()=>setDateShow(!dateShow)} style={styles.register}>
                <FontText style={[styles.text]}>날짜 선택하기</FontText>
            </TouchableOpacity>

            <FontText style={[globalStyles.textNomal]}>전화번호</FontText>
            <TextInput  style={[globalStyles.input,styles.input]}  onChangeText={(text)=>setContact(text)}
            value={contact}   keyboardType="number-pad"/>

            <CustomButton onPress={()=>onRegister()} styleBtn={[globalStyles.button]} styleText={[globalStyles.buttonText]}>가입</CustomButton>
        </View>

        <TouchableOpacity onPress={moveLogin} style={styles.register}>
                <FontText style={[styles.text]}>로그인 하시겠습니까?</FontText>
        </TouchableOpacity>
    </View>
    );
}

export default RegisterScreen;

const styles = StyleSheet.create({
    container : {
        flex : 1,
    },
    inputContain:{
        padding : 20
    },  
    input : {
        marginBottom : 20
    },
    register : {
        padding : 20,
        
    },
    text : {
        textAlign : "center"
    }
});