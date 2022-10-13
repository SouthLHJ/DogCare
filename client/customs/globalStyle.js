import { StyleSheet, View } from "react-native";

// export const colors = {
//     main: "#92B4EC",
//     sub: "#F8888E",
//     mid: "#FFBD41",
//     black: "#444249",
//     white: "#FCFBF3",
//     dark: "#757889",
//     semi: "#BEC0CD",
//     light: "#ECECED"
// };
export const colors = {
    main: "#2757A5",
    sub: "#FF9973",
    mid: "#7ECFE0",
    black: "#444249",
    white: "#FCFBF3",
    dark: "#222A59",
    semi: "#D1D2DA",
    light: "#ECECED"
};

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: "#ffffff",
        margin: 12,
        marginTop: 0,
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12
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
        height: 34
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