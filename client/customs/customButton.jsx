import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

function CustomButton({children,onPress, styleBtn,styleText}) {
    return ( 
        <View style={styles.container}>
            <Pressable onPress={onPress}  android_ripple={{color :  "#000033"}} 
            style={[styles.buttonOutContainer,styleBtn]}
            >
                <View style={styles.buttonInContainer} >
                    <Text style={[styles.buttonText,styleText]}>{children}</Text>
                </View>
            </Pressable>
        </View>
     );
}

export default CustomButton;

const styles = StyleSheet.create({
    container: {
        overflow : "hidden",
        
        borderWidth : 1,
        borderRadius : 2,
        borderColor : "#0089FF"
    },
    
    buttonOutContainer : {
        overflow : "hidden",

        backgroundColor : "#0089FF",
        borderColor : "#0089FF",
        borderWidth : 1,

        // marginVertical : 8,
        // marginHorizontal : 8,
        paddingHorizontal : 5,
        paddingVertical : 6,
        elevation : 9,
        opacity : 1
    },
    buttonInContainer : {
        borderColor : "#0089FF",
    },
    buttonText : {
        textAlign : "center",
        color : "white",
        fontSize : 16
    }
})