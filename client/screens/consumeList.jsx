/*
    표
    - 설치 :  npm install --save prop-types / npm i react-native-table-component
    - 참고페이지 : https://www.npmjs.com/package/react-native-table-component
*/
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

//icon

import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyles from '../customs/globalStyle';
import { useContext, useEffect, useState } from 'react';
import Loading from '../customs/loading';
import { AppContext } from '../contexts/app-context';
import { ConsumeContext } from '../contexts/consume-context';
import ListConsume from '../components/listCnsm';
import FontText from '../customs/fontText';
import CustomDatePicker from '../customs/datePicker';
import CustomButton from '../customs/customButton';
import { readConsumeMontly } from '../api/consume';


function ConsumeListScreen() {
    const context  = useContext(AppContext);
    const consumeContext = useContext(ConsumeContext);

    const [date1, setDate1] = useState(new Date());
    const [date2, setDate2] = useState(new Date());

    //func
    const onSearch = ()=>{
        console.log("!@!@1");
        readConsumeMontly(date1,date2,context.auth.token)
         .then((rcv)=>{
            console.log(rcv)
         })
         .catch(err=>console.log("onSearch ConsumeList => ",err))
    }

    return (  
    <View style={globalStyles.container}>
        <View style={styles.searchDateContainer}>
            <CustomDatePicker start={true} end={true} startPoint={date1} setStartPoint={setDate1} endPoint={date2} setEndPoint={setDate2}/>
            <TouchableOpacity onPress={()=>onSearch()}>
                <FontText>검색</FontText>
            </TouchableOpacity>
        </View>
        <ScrollView style={{height : 200}}>
            <ListConsume />
        </ScrollView>
    </View>
    );
}

export default ConsumeListScreen;

const styles = StyleSheet.create({
    plusIcon : {
        marginVertical : 5,
        alignItems  : "flex-end"
    },

    searchDateContainer :{
        flexDirection : "row",
        justifyContent: "space-around"
    },
        
    // 표
    head: {  height: 40,  backgroundColor: '#f1f8ff'  },
    row: {  height: 28  },
    text: { textAlign: 'center' }
});