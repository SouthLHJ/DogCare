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
        <RegisterConsume />
        <Text>2. 삭제</Text>
        <ScrollView style={{flex : 1}}>
            <DeleteConsume />
        </ScrollView>
        <Text>3. 수정</Text>
    </View>
    </TouchableWithoutFeedback>
    );
}

export default ConsumeRegisterScreen;

const styles = StyleSheet.create({
    register : {
    },

    // 표
    tableContainer: { marginBottom : 30,backgroundColor: '#fff' },
    head: {  height: 40,  backgroundColor: '#f1f8ff', borderWidth : 1  },
    row: {  height: 30 , borderLeftWidth :1, borderBottomWidth :1 , borderRightWidth : 1  },
    text: { textAlign: 'center' }
});