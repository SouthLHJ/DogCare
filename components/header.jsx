import { StyleSheet, Text, View } from "react-native";
import FontText from "../customs/fontText";

function Header() {
    return (  
        <View style={styles.container}>
            <FontText style={{color : "white"}}>여기는 헤더</FontText>
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    container : {
        marginTop : 30,
        height : 50,
        backgroundColor : "#0089FF",
        justifyContent  : "center",
        alignItems : "center"
    }
});