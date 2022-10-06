/*
    표
    - 설치 :  npm install --save prop-types / npm i react-native-table-component
    - 참고페이지 : https://www.npmjs.com/package/react-native-table-component
*/
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
//icon
import { AntDesign } from '@expo/vector-icons';

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyles from '../customs/globalStyle';
import { useContext, useEffect, useState } from 'react';
import Loading from '../customs/loading';
import { readConsumeList } from '../api/consume';
import { AppContext } from '../contexts/app-context';


function ConsumeListScreen() {
    const context  = useContext(AppContext);

    const [data,setData] = useState();
    const [startPoint, setStartPoint] = useState(new Date());
    const [endPoint, setEndPoint] = useState(new Date());

    useEffect(()=>{
        // 소비내역 이번달 꺼 싹 불러오는 api 실행
        const data = {
            startPoint,
            endPoint
        }
        const token  = context.auth.token
        readConsumeList(data, token)
         .then((rcv)=>{
            console.log(rcv)
         })
        // 실행해서 나온 값을 저장하게한다.
        setData(
            {
                tableHead: ['', 'Head1', 'Head2', 'Head3'],
                tableTitle: ['Title', 'Title2', 'Title3', 'Title4'],
                tableData: [
                    ['1', '2', '3'],
                    ['a', 'b', 'c'],
                    ['1', '2', '3'],
                    ['a', 'b', 'c']
                ]
            }
        )
    },[])

    //func
    const onRegister = ()=>{

    }

    if(!data){
        return(
            <Loading/>
        );
    }
    return (  
    <View style={globalStyles.container}>
        <TouchableOpacity onPress={()=>onRegister()} style={styles.plusIcon}>
            <AntDesign name="pluscircleo" size={20} color="black" />
        </TouchableOpacity>

        <Table borderStyle={{borderWidth: 1}}>
          <Row data={data.tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text}/>
          <TableWrapper style={styles.wrapper}>
            <Col data={data.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
            <Rows data={data.tableData} flexArr={[2, 1, 1]} style={styles.row} textStyle={styles.text}/>
          </TableWrapper>
        </Table>


    </View>
    );
}

export default ConsumeListScreen;

const styles = StyleSheet.create({
    plusIcon : {
        marginVertical : 5,
        alignItems  : "flex-end"
    },
        
    // 표
    head: {  height: 40,  backgroundColor: '#f1f8ff'  },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 28  },
    text: { textAlign: 'center' }
});