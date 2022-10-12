import { StyleSheet, View } from "react-native";
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import FontText from "./fontText";

export const colors = {
    main: "#82ABDF",
    sub: "#F5AD85",
    mid: "#EED57D",
    black: "#444249",
    white: "#FCFBF3",
    dark: "#757889",
    semi: "#BEC0CD",
    light: "#F3F3F5"
};

export const header = () => {
    return (
        <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
            <FontAwesome name="heart" size={18} color={colors.white} />
            <FontText title={true} style={{ fontSize: 24, color: colors.white }}>
                내새꾸
            </FontText>
            <FontAwesome name="heart" size={18} color={colors.white} />
        </View>
    )
};

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,

        backgroundColor: "#ffffff"
    },
    input: {
        borderColor: colors.black,
        borderWidth: 1
    },
    button: {
        backgroundColor: colors.mid,
        borderColor: colors.mid
    },
    buttonText: {
        fontFamily: "BlackHanSans-Regular",
        color: colors.white
    },

    textNomal :{
        fontSize : 14
    },
    textTitle :{
        fontSize : 20
    },
    textAlarm : {
        fontSize : 14,
        color : "red"
    },
    loading: {
        backgroundColor: `rgba(50,50,50,0.5)`
    }

})

export default globalStyles