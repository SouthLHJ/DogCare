import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import CustomButton from "../customs/customButton";
import FontText from "../customs/fontText";
import globalStyles from "../customs/globalStyle";

function RegisterScreen() {
    const [id,setId] = useState(null);
    const [pw,setPw] = useState(null);
    const [rePw,setRePw] = useState(null);
    const navigation = useNavigation();

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

            <CustomButton styleBtn={[globalStyles.button]} styleText={[globalStyles.buttonText]}>가입</CustomButton>
        </View>
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