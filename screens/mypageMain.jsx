import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";

function MypageMainScreen() {
    const context = useContext(AppContext);

    //func
    const sendLogout = ()=>{
        context.dispatch({type: "logout"})
    }

    return (  
    <View>
        <TouchableOpacity onPress={sendLogout} style={styles.touchable}>
                <FontText style={[styles.text]}>로그아웃</FontText>
        </TouchableOpacity>
    </View>
    );
}

export default MypageMainScreen;

const styles = StyleSheet.create({
    touchable : {
        padding : 20,
        
    },
    text : {
        textAlign : "center",
    }
});