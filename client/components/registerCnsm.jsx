import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import DateTimePicker from '@react-native-community/datetimepicker';


import {  StyleSheet, Text, TextInput, TouchableOpacity,View } from "react-native";
import { useContext, useState } from 'react';
import globalStyles from '../customs/globalStyle';
import FontText from '../customs/fontText';
import { AppContext } from '../contexts/app-context';
import { readConsumeAll, writeConsume } from '../api/consume';
import { ConsumeContext } from '../contexts/consume-context';
import CustomDatePicker from '../customs/datePicker';


function RegisterConsume() {
    const context = useContext(AppContext);
    const consumeContext = useContext(ConsumeContext);

    // 자동완성
    const [selectedItem, setSelectedItem] = useState({id: '1', title: '용품'});
    const [selectedItemShow, setSelectedItemShow] = useState(false);
    // 날짜 선택
    const [date, setDate] = useState(new Date());
    // 가격
    const [price, setPrice] = useState("")
    // 메모
    const [comment, setComment] = useState("")

    const tableInput = [
        [
            <CustomDatePicker end={false} setStartPoint={setDate} startPoint={date}/>,
            <View style={{flexDirection : "row", justifyContent : "center"}}>
                <FontText>{selectedItem?.title}</FontText>
                <TouchableOpacity onPress={()=>setSelectedItemShow(!selectedItemShow)} style={[styles.register,{marginLeft : 20}]}>
                    <FontText style={{color : "blue"}}>선택</FontText>
                </TouchableOpacity>
            </View>,
            <View style={{alignItems : "center"}}>
                <TextInput  keyboardType='number-pad' onChangeText={(text)=>setPrice(text)} value={price}/>
            </View>,
            <View style={{alignItems : "center"}}>
                <TextInput  keyboardType='email-address'  onChangeText={(text)=>setComment(text)} value={comment}/>
            </View>,
            <TouchableOpacity onPress={()=>onRegister()} style={styles.register}>
                <FontText style={styles.text}>등록하기</FontText>
            </TouchableOpacity>
        ]
    ]

    //func
    const onRegister = ()=>{
        const data = {
            userId : context.auth.id,
            date : date,
            description: comment,
            category : selectedItem.title,
            ammount: Number(price)
        }
        // console.log(data)
        writeConsume(data,context.auth.token)
         .then((rcv)=>{
            // console.log(rcv)
            if(rcv.result){
                onRefresh();
                setDate(new Date()); setPrice(""); setComment(""); 
            }
         })
         .catch(err=>console.log("writeConsume  => ", err))
    }

    const onRefresh = ()=>{
        readConsumeAll(context.auth.token)
         .then((rcv)=>{
            // console.log(rcv)
            if(rcv.result){
                consumeContext.dispatch({type: "update", payload : rcv.list})
            }
         })
         .catch(err=>console.log("onRefresh readConsumeAll = > ", err))
    }

    return (  
        <>
            <Text>1. 등록</Text>
            <View style={styles.tableContainer}>
                <Table>
                    <Row data={["날짜","카테고리","소비가격","내용", "등록"]} flexArr={[1, 1, 1, 1,1]} style={styles.head} textStyle={styles.text}/>
                    <Rows data={tableInput} flexArr={[1,1, 1, 1,1]} style={styles.row} />
                </Table>
            </View>
            {selectedItemShow &&
                <AutocompleteDropdown
                    clearOnFocus={false}
                    closeOnBlur={true}
                    closeOnSubmit={false}
                    initialValue={{id: '1', title: '용품'}} // or just '2'
                    onSelectItem={setSelectedItem}
                    dataSet={[
                    {id: '1', title: '용품'},
                    {id: '2', title: '간식'},
                    {id: '3', title: '사료'},
                    {id: '4', title: '위생'},
                    {id: '5', title: '약'},
                    {id: '6', title: '치료비'}
                    ]}  
                />
            }
        </>
    );
}

export default RegisterConsume;

const styles = StyleSheet.create({
    register : {
    },

    // 표
    tableContainer: { marginBottom : 30,backgroundColor: '#fff' },
    head: {  height: 40,  backgroundColor: '#f1f8ff', borderWidth : 1  },
    row: {  height: 30 , borderLeftWidth :1, borderBottomWidth :1 , borderRightWidth : 1  },
    text: { textAlign: 'center' }
});