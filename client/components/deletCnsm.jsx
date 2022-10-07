import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import { useContext, useEffect, useState } from "react";
import { ConsumeContext } from "../contexts/consume-context";
import Loading from "../customs/loading";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FontText from '../customs/fontText';
import { deleteOneConsume, readConsumeAll } from '../api/consume';
import { AppContext } from '../contexts/app-context';

function DeleteConsume() {
    const context = useContext(AppContext);
    const consumeContext = useContext(ConsumeContext);

    const [data,setData] = useState();


    useEffect(()=>{
        // 소비내역 싹 불러오는 api 실행
        const arr = consumeContext.data
        // console.log(arr)
        const combineArr = arr.map((one)=>{
            // console.log(one)
            return [one.date.slice(0,10), one.category, one.ammount, one.description, <TouchableOpacity onPress={()=>onDelete(one._id)}><FontText style={{textAlign :"center"}}>삭제</FontText></TouchableOpacity>]
        }) 
        // 실행해서 나온 값을 저장하게한다.
        setData(combineArr)
    },[consumeContext.data])

    //func
    const onDelete = (item)=>{
        // console.log(item)
        deleteOneConsume(item)
        .then((rcv)=>{
            // console.log(rcv);
            if(rcv.result){
                onRefresh();
            }
        })
        .catch(err=>console.log("onDelete => ",err))
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


    if(!data){
        return(
            <Loading/>
        );
    }

    return (  
        <View style={styles.tableContainer}>
            <Table>
                <Row data={["날짜","카테고리","소비가격","내용","삭제"]} flexArr={[1, 1, 1, 1, 1]} style={styles.head} textStyle={styles.text}/>
                <Rows data={data} flexArr={[1, 1, 1, 1, 1]} style={styles.row} textStyle={styles.text} />
            </Table>
        </View>
    );
}

export default DeleteConsume;

const styles = StyleSheet.create({
    register : {
    },

    // 표
    tableContainer: { marginBottom : 30,backgroundColor: '#fff' },
    head: {  height: 40,  backgroundColor: '#f1f8ff', borderWidth : 1  },
    row: {  height: 30 , borderLeftWidth :1, borderBottomWidth :1 , borderRightWidth : 1  },
    text: { textAlign: 'center' }
    
});