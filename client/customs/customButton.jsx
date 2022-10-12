import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import globalStyles from "./globalStyle";

function CustomButton({children,onPress, styleBtn,styleText}) {
    return ( 
            <Pressable onPress={onPress}  android_ripple={{color :  "#666666"}} 
            style={[styles.buttonOutContainer, globalStyles.button,styleBtn]}
            >
                    <Text style={[styles.buttonText,styleText]}>{children}</Text>
            </Pressable>
     );
}

export default CustomButton;

const styles = StyleSheet.create({
    container: {
    },
    
    buttonOutContainer : {
        overflow : "hidden",
        borderWidth : 1,

        // marginVertical : 8,
        // marginHorizontal : 8,
        paddingHorizontal : 5,
        paddingVertical : 6,
        elevation : 4,
    },
    buttonText : {
        textAlign : "center",
        color : "white",
        fontSize : 16
    }
})