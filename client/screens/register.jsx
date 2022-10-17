import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard, ScrollView, TouchableWithoutFeedback } from "react-native";
import CustomButton from "../customs/customButton";
import FontText from "../customs/fontText";
import globalStyles from "../customs/globalStyle";

import DateTimePicker from '@react-native-community/datetimepicker';
import { sendRegister } from "../api/account";
import CustomDatePicker from "../customs/datePicker";

function RegisterScreen({ navigation }) {
    const [id, setId] = useState(null);
    const [pw, setPw] = useState(null);
    const [rePw, setRePw] = useState(null);
    const [nick, setNick] = useState(null);
    const [date, setDate] = useState(new Date());
    // const [hide, setHide ] =useState(false);
    const [contact, setContact] = useState(null);



    //func
    const moveLogin = () => {
        navigation.navigate("login");
    }
    const onRegister = () => {
        //아이디 양식 틀림
        if (!(/[a-z0-9]{4,}/.test(id))) {
            return
        }
        //전화번호 양식 틀림
        if (!(/^[0-1]{3}\d{3,4}\d{4}$/.test(contact))) {
            return
        }
        // 비밀번호 양식 틀림
        if (!(/[a-zA-z0-9`~!@#$%^&*]{4,}/).test(pw)) {
            return
        }
        // 비밀번호 재확인 틀림
        if (!(rePw === pw)) {
            return
        }
        if (!(id && pw && nick && contact)) {
            Alert.alert(
                "", "아이디, 비밀번호, 이름, 전화번호 작성은 필수입니다.", [{
                    text: "확인"
                }]
            )
        } else {
            const data = {
                id: id,
                password: pw,
                name: nick,
                birth: date,
                contact: contact
            }
            // console.log(data)
            sendRegister(data)
                .then((rcv) => {
                    if (rcv.result) {
                        Alert.alert(
                            "가입 성공!", "로그인해서 내새꾸 앱을 즐겨보세요!", [{
                                text: "확인", onPress: () => { setId(null); setPw(null); setRePw(null); setNick(null); setDate(new Date()); setContact(null); navigation.navigate("login") }
                            }]
                        )
                    } else {
                        Alert.alert(
                            "가입 실패!", "가입에 실패했어요... 다시 시도 해 주세요.", [{
                                text: "확인", onPress: () => { setId(null); setPw(null); setRePw(null); setNick(null); setDate(new Date()); setContact(null) }
                            }]
                        )
                        console.log("sendRegister server => ", rcv.msg)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    // //키보드 유무
    // Keyboard.addListener("keyboardDidShow", ()=>setHide(true))
    // Keyboard.addListener("keyboardDidHide", ()=>setHide(false))

    let idAlarm = (<FontText></FontText>)
    if (id) {
        if (!(/[a-z0-9]{4,}/.test(id))) {
            idAlarm = (<FontText style={[globalStyles.textAlarm, { fontSize: 10, textAlign: "right" }]}>4~20자의 영문 소문자만 사용가능합니다.</FontText>)
        }
    }
    let passwordAlarm = (<FontText></FontText>)
    if (pw) {
        if (!(/[a-zA-z0-9`~!@#$%^&*]{4,}/).test(pw)) {
            passwordAlarm = (<FontText style={[globalStyles.textAlarm, { fontSize: 10, textAlign: "right" }]}>영문자, 숫자, 특수문자(`~!@#$%^&*)만 사용 가능합니다.</FontText>)
        }
    }
    let contactAlarm = (<FontText></FontText>)
    if (contact) {
        if (!(/^[0-1]{3}\d{3,4}\d{4}$/.test(contact))) {
            contactAlarm = (<FontText style={[globalStyles.textAlarm, { fontSize: 10, textAlign: "right" }]}>전화번호 양식에 맞지않습니다.</FontText>)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >

            <View style={styles.container}>
                <View style={[globalStyles.innerContainer]}>
                    <View style={{ alignItems: "flex-start", width: 320 }}>
                        <ScrollView style={{ width: 320 }}>
                            <View style={{ alignItems: "flex-start", width: 320 }}>
                                <FontText style={[globalStyles.textNomal, globalStyles.label]} bold={"semi"}>아이디</FontText>
                                <TextInput style={[globalStyles.input]} onChangeText={(text) => setId(text)} autoCapitalize="none"
                                    value={id} keyboardType="email-address" />
                                {idAlarm}

                            </View>

                            <View style={{ alignItems: "flex-start", width: 320 }}>
                                <FontText style={[globalStyles.textNomal, globalStyles.label]} bold={"semi"}>비밀번호</FontText>
                                <TextInput style={[globalStyles.input]} onChangeText={(text) => setPw(text)} secureTextEntry={true} autoCapitalize="sentences"
                                    value={pw} />
                                {passwordAlarm}

                            </View>

                            <View style={{ alignItems: "flex-start", width: 320 }}>
                                <FontText style={[globalStyles.textNomal, globalStyles.label]} bold={"semi"}>비밀번호 재확인</FontText>
                                <TextInput style={[globalStyles.input]} onChangeText={(text) => setRePw(text)} secureTextEntry={true} autoCapitalize="sentences"
                                    value={rePw} />
                                {((rePw !== pw) && rePw) ? <FontText style={[globalStyles.textAlarm, { fontSize: 10, textAlign: "right" }]}>비밀번호가 일치하지않습니다.</FontText> : <FontText></FontText>}
                            </View>


                            <View style={{ alignItems: "flex-start", width: 320 }}>

                                <FontText style={[globalStyles.textNomal, globalStyles.label]} bold={"semi"}>닉네임</FontText>
                                <TextInput style={[globalStyles.input, styles.input]} onChangeText={(text) => setNick(text)}
                                    value={nick} keyboardType="email-address" />
                            </View>

                            <View style={{ alignItems: "flex-start", width: 320 }}>

                                <View style={{ marginBottom: 15 }}>
                                    <FontText style={[globalStyles.textNomal, globalStyles.label]} bold={"semi"}>생년월일</FontText>
                                    <CustomDatePicker start={true} end={false} startPoint={date} setStartPoint={setDate} />
                                </View>
                            </View>

                            <View style={{ alignItems: "flex-start", width: 320 }}>

                                <FontText style={[globalStyles.textNomal, globalStyles.label]} bold={"semi"}>전화번호</FontText>
                                <TextInput style={[globalStyles.input]} onChangeText={(text) => setContact(text)}
                                    value={contact} keyboardType="number-pad" />
                                {contactAlarm}
                            </View>
                        </ScrollView>
                    </View>

                    <CustomButton onPress={() => onRegister()} styleBtn={[globalStyles.button, styles.button]} styleText={[globalStyles.buttonText]}>가입</CustomButton>

                    <TouchableOpacity onPress={moveLogin} style={styles.register}>
                        <FontText style={[styles.text]}>로그인 하시겠습니까?</FontText>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContain: {
        padding: 20
    },
    input: {
        marginBottom: 20
    },
    register: {
        padding: 20,

    },
    text: {
        textAlign: "center"
    },
    button: {
        width: 120,
        alignSelf: "center",
        marginTop: 24
    },
});