import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import { useContext, useEffect, useState } from "react";
import { ConsumeContext, SearchContext } from "../contexts/consume-context";
import Loading from "../customs/loading";
import { StyleSheet, View } from 'react-native';
import FontText from '../customs/fontText';
import { colors } from '../customs/globalStyle';

function ListConsume() {
    // const consumeContext = useContext(ConsumeContext);
    const searchConsume = useContext(SearchContext);

    const [data,setData] = useState();


    useEffect(()=>{
        if(searchConsume?.search){
            // 소비내역 싹 불러오는 api 실행
            const arr = searchConsume?.search
            // console.log(arr)
            const combineArr = arr.map((one)=>{
                return [<FontText style={styles.textRow}>{one.date.slice(0,10)}</FontText>,
                 <FontText style={styles.textRow}>{one.category}</FontText>,
                 <FontText style={styles.textRow}>{one.ammount}</FontText>, 
                 <FontText style={styles.textRow}>{one.description}</FontText>]
            }) 
            // 실행해서 나온 값을 저장하게한다.
            setData(combineArr)
        }
    },[searchConsume.search])

    const tableTitle = [
        <FontText style={styles.textTitle}>날짜</FontText>,
        <FontText style={styles.textTitle}>카테고리</FontText>,
        <FontText style={styles.textTitle}>소비액</FontText>,
        <FontText style={styles.textTitle}>내용</FontText>,
    ]

    if(!data){
        return(
            <Loading/>
        );
    }

    return (  
        <View style={styles.tableContainer}>
            <Table>
                <Row data={tableTitle} flexArr={[1, 1, 1, 1]} style={styles.head} />
                <Rows data={data} flexArr={[1, 1, 1, 1]} style={styles.row}/>
            </Table>
        </View>
    );
}

export default ListConsume;

const styles = StyleSheet.create({
    register : {
    },

    // 표
    tableContainer: { marginBottom : 30,backgroundColor: '#fff', },
    head: {  height: 40,  backgroundColor: colors.mid, borderColor : colors.mid , borderWidth : 1, borderTopLeftRadius : 5 , borderTopRightRadius : 5  },
    row: {  height: 35 , borderLeftWidth :1, borderBottomWidth :1 , borderRightWidth : 1 , borderColor : colors.mid},
    textTitle : { textAlign: 'center' , color : colors.white },
    textRow : { textAlign: 'center' , color : colors.black }
});