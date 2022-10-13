import {  Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useState } from 'react';
import globalStyles from '../customs/globalStyle';
import FontText from '../customs/fontText';
import RegisterConsume from "../components/registerCnsm";
import DeleteConsume from "../components/deletCnsm";

function ConsumeRegisterScreen() {
    const [data,setData] = useState();
    
    return (  
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={globalStyles.container}>
        <View style={{marginBottom : 10}}>
            <RegisterConsume />
        </View>

        <ScrollView style={{flex : 1}}>
            <DeleteConsume />
        </ScrollView>
    </View>
    </TouchableWithoutFeedback>
    );
}

export default ConsumeRegisterScreen;

const styles = StyleSheet.create({
    register : {
    },
});