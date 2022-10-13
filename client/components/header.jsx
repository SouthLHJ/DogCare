import { StyleSheet, Text, View } from "react-native";
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import FontText from "../customs/fontText";
import { colors } from "../customs/globalStyle";

function Header() {
    return (
        <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
            <FontAwesome name="heart" size={18} color={colors.white} />
            <FontText title={true} style={{ fontSize: 24, color: colors.white }}>
                내새꾸
            </FontText>
            <FontAwesome name="heart" size={18} color={colors.white} />
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