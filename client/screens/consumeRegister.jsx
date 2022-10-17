import {  Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useState } from 'react';
import globalStyles, { colors } from '../customs/globalStyle';
import FontText from '../customs/fontText';
import RegisterConsume from "../components/registerCnsm";
import DeleteConsume from "../components/deletCnsm";

function ConsumeRegisterScreen() {
    const [data,setData] = useState();
    
    return (  
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={globalStyles.container}>
        <View style={{ marginVertical : 10, paddingBottom : 17, borderBottomColor : colors.light, borderBottomWidth : 2, zIndex: 1000}}>
            <RegisterConsume />
        </View>

        <View>
            <DeleteConsume />
        </View>
    </View>
    </TouchableWithoutFeedback>
    );
}

export default ConsumeRegisterScreen;

const styles = StyleSheet.create({
    register : {
    },
});