import { StyleSheet, View } from "react-native";

export const colors = {
    main: "#82ABDF",
    sub: "#F5AD85",
    mid: "#FAD476",
    black: "#444249",
    white: "#FCFBF3",
    dark: "#757889",
    semi: "#BEC0CD",
    light: "#ECECED"
};

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: "#ffffff"
    },
    innerContainer: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        margin: 12,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 8,
    },
    label: {
        borderBottomWidth: 1,
        borderBottomColor: colors.dark,
        color: colors.black,
        margin: 4,
        marginBottom: 8
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 8,
        padding: 2,
        paddingHorizontal: 4,
        borderColor: colors.dark,
    },
    button: {
        backgroundColor: colors.mid,
        borderColor: colors.mid,
        borderRadius: 6
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
        backgroundColor: `rgba(50,50,50,1)`
    }

})

export default globalStyles