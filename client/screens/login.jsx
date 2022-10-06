import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AppContext } from "../contexts/app-context";
import CustomButton from "../customs/customButton";
import FontText from "../customs/fontText";
import globalStyles from "../customs/globalStyle";

function LoginScreen() {
    const context  = useContext(AppContext);

    const [id,setId] = useState(null);
    const [pw,setPw] = useState(null);
    const navigation = useNavigation();
    //func
    const moveRegister = ()=>{
        navigation.navigate("register")
    }
    const sendLogin = ()=>{
        context.dispatch({type : "login", payload : {id : "test", pw : "0000", token : "sampleToken"}})
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

            <CustomButton onPress={()=>sendLogin()} styleBtn={[globalStyles.button]} styleText={[globalStyles.buttonText]}>로그인</CustomButton>
        </View>
        
        <TouchableOpacity onPress={moveRegister} style={styles.touchable}>
                <FontText style={[styles.text]}>회원가입</FontText>
        </TouchableOpacity>
    </View>
    );
}

export default LoginScreen;

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
    touchable : {
        padding : 20,
        
    },
    text : {
        textAlign : "center",
        
    }
});