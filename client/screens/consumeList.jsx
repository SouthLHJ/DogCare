/*
    표
    - 설치 :  npm install --save prop-types / npm i react-native-table-component
    - 참고페이지 : https://www.npmjs.com/package/react-native-table-component
*/
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

//icon

import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyles, { colors } from '../customs/globalStyle';
import { useContext, useEffect, useState } from 'react';
import Loading from '../customs/loading';
import { AppContext } from '../contexts/app-context';
import { ConsumeContext, SearchContext } from '../contexts/consume-context';
import ListConsume from '../components/listCnsm';
import FontText from '../customs/fontText';
import CustomDatePicker from '../customs/datePicker';
import CustomButton from '../customs/customButton';
import { readConsumeMontly } from '../api/consume';


function ConsumeListScreen() {
    const context  = useContext(AppContext);
    const consumeContext = useContext(ConsumeContext);
    const searchConsume = useContext(SearchContext);

    const [date1, setDate1] = useState(new Date(new Date().setMonth(new Date().getMonth()-1)));
    const [date2, setDate2] = useState(new Date());

    useEffect(()=>{
        onSearch();
    },[consumeContext.data])
    //func
    const onSearch = ()=>{
        readConsumeMontly(date1,date2,context.auth.token)
         .then((rcv)=>{
            // console.log(rcv);
            if(rcv.result){
                searchConsume.searchdispatch({type: "search", payload: rcv.list})
            }else{
                console.log("readConsumeMontly server => ",rcv.msg)
            }
         })
         .catch(err=>console.log("readConsumeMontly => ",err))
    }

    return (  
    <View style={globalStyles.container}>
        <View style={styles.searchDateContainer}>
            <View style={{flex :1, alignItems :"center"}}>
                <CustomDatePicker start={true} end={true} startPoint={date1} setStartPoint={setDate1} endPoint={date2} setEndPoint={setDate2}/>
            </View>
            <TouchableOpacity style={{backgroundColor : colors.main, paddingVertical : 5, paddingHorizontal :10, borderRadius : 10}} onPress={()=>onSearch()}>
                <FontText style={[globalStyles.textNomal,{color : colors.white}]}>검색</FontText>
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
        alignItems :"center",
        marginBottom : 8
    },
        
});