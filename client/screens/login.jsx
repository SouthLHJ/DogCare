import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { sendLogin } from "../api/account";
import { AppContext } from "../contexts/app-context";
import CustomButton from "../customs/customButton";
import FontText from "../customs/fontText";
import globalStyles from "../customs/globalStyle";

function LoginScreen({navigation}) {
    const context = useContext(AppContext);
    const [id, setId] = useState(null);
    const [pw, setPw] = useState(null);
    //func

    const onLogin = () => {
        const data = {
            id: id,
            password: pw
        }
        // console.log(data)
        sendLogin(data)
            .then((rcv) => {
                if (rcv.result) {
                    // console.log(rcv)
                    Alert.alert(
                        "", `${rcv.msg}`
                    )
                    context.dispatch({ type: "login", payload: { id: id, pw: pw, token: rcv.token } })
                } else {
                    Alert.alert(
                        "", `${rcv.msg}`
                    )
                    console.log(rcv)
                }
            }).catch(e => console.log(e))
    }

    return (
        <View style={styles.container}>
            <View style={globalStyles.innerContainer}>
                <View style={{ width: 280 }}>
                    <View style={{ alignItems: "flex-start" }}>
                        <FontText bold="semi" style={[globalStyles.textNomal, globalStyles.label]}>아이디</FontText>
                    </View>
                    <TextInput style={[globalStyles.input, styles.input]} onChangeText={(text) => setId(text)}
                        value={id} keyboardType="email-address" />
                    <View style={{ alignItems: "flex-start" }}>
                        <FontText bold="semi" style={[globalStyles.textNomal, globalStyles.label]}>비밀번호</FontText>
                    </View>
                    <TextInput style={[globalStyles.input, styles.input]} onChangeText={(text) => setPw(text)} secureTextEntry={true} autoCapitalize="sentences"
                        value={pw} />

                    <CustomButton onPress={() => onLogin()} styleBtn={[globalStyles.button, styles.button]} styleText={[globalStyles.buttonText]}>로그인</CustomButton>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("register");
                    }} style={styles.touchable}>
                        <FontText style={[styles.text]}>아직 계정이 없으신가요?</FontText>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContain: {
        flex: 1,
        padding: 20
    },
    input: {
        marginBottom: 18,
    },
    touchable: {
        padding: 20,
    },
    button: {
        width: 120,
        alignSelf: "center",
        marginTop: 24
    },
    text: {
        textAlign: "center",

    }
});