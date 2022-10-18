import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import DateTimePicker from '@react-native-community/datetimepicker';


import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import globalStyles, { colors } from '../customs/globalStyle';
import FontText from '../customs/fontText';
import { AppContext } from '../contexts/app-context';
import { readConsumeAll, writeConsume } from '../api/consume';
import { ConsumeContext } from '../contexts/consume-context';
import CustomDatePicker from '../customs/datePicker';


function RegisterConsume() {
    const context = useContext(AppContext);
    const consumeContext = useContext(ConsumeContext);

    // 자동완성
    const [selectedItem, setSelectedItem] = useState({ id: '1', title: '용품' });
    const [selectedItemShow, setSelectedItemShow] = useState(false);
    // 날짜 선택
    const [date, setDate] = useState(new Date());
    // 가격
    const [price, setPrice] = useState("")
    // 메모
    const [comment, setComment] = useState("")

    const tableInput = [
        [
            <View style={{ flexDirection: "row", justifyContent: "center", borderBottomColor: colors.mid, borderBottomWidth: 1, marginHorizontal: 1 }}>
                <CustomDatePicker end={false} setStartPoint={setDate} startPoint={date} textStyle={{ fontSize: 10 }} />
            </View>,
            <View style={{ alignItems: "center" }}>
                <TouchableOpacity onPress={() => setSelectedItemShow(!selectedItemShow)} style={[styles.register, { marginVertical: 2 }]}>
                    <FontText style={[styles.textRow, { color: 'white', marginVertical: 8 }]}>{selectedItem?.title}</FontText>
                </TouchableOpacity>
            </View>,
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TextInput style={[styles.textRow, { width: "100%" }]} keyboardType='number-pad' onChangeText={(text) => setPrice(text)} value={price} />
            </View>,
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TextInput style={[styles.textRow, { width: "100%" }]} keyboardType='email-address' onChangeText={(text) => setComment(text)} value={comment} />
            </View>,
            <View style={{ alignItems: "center" }}>
                <TouchableOpacity onPress={() => onRegister()} style={{ width: "60%", justifyContent: "center", alignItems: "center" }}>
                    <AntDesign name="checkcircleo" size={22} color={colors.mid} />
                </TouchableOpacity>
            </View>
        ]
    ]

    //func
    const onRegister = () => {
        if (!(date && selectedItem.title && price)) {
            Alert.alert("", "날짜와 카테고리, 소비액은 필수 입력 요소입니다.");
            return;
        };

        const data = {
            userId: context.auth.id,
            date: date,
            description: comment,
            category: selectedItem.title,
            ammount: Number(price)
        }
        // console.log(data)
        writeConsume(data, context.auth.token)
            .then((rcv) => {
                // console.log(rcv)
                if (rcv.result) {
                    onRefresh();
                    setDate(new Date()); setPrice(""); setComment("");
                }
            })
            .catch(err => console.log("writeConsume  => ", err))

        setSelectedItem({ id: '1', title: '용품' })
    }

    const onRefresh = () => {
        readConsumeAll(context.auth.token)
            .then((rcv) => {
                // console.log(rcv)
                if (rcv.result) {
                    consumeContext.dispatch({ type: "update", payload: rcv.list })
                }
            })
            .catch(err => console.log("onRefresh readConsumeAll = > ", err))
    }
    const tableTitle = [
        <FontText style={styles.textTitle}>날짜</FontText>,
        <FontText style={styles.textTitle}>카테고리</FontText>,
        <FontText style={styles.textTitle}>소비액</FontText>,
        <FontText style={styles.textTitle}>내용</FontText>,
        <FontText style={styles.textTitle}>등록</FontText>,
    ]

    return (
        <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <FontText style={globalStyles.textNomal} bold={true} title={true}>등록</FontText>

                <View style={styles.tableContainer}>
                    <Table>
                        <Row data={tableTitle} flexArr={[1, 1, 1, 1, 1]} style={styles.head} />
                        <Rows data={tableInput} flexArr={[1, 1, 1, 1, 1]} style={styles.row} />
                    </Table>
                </View>
            </TouchableWithoutFeedback>
            {selectedItemShow &&
                <AutocompleteDropdown
                    clearOnFocus={false}
                    closeOnBlur={true}
                    closeOnSubmit={false}
                    initialValue={selectedItem} // or just '2'
                    onSelectItem={(item) => setSelectedItem((current) => {
                        return item ? item : current;
                    })}
                    onChangeText={(text) => setSelectedItem({ id: '0', title: text })}
                    dataSet={[
                        { id: '1', title: '용품' },
                        { id: '2', title: '간식' },
                        { id: '3', title: '사료' },
                        { id: '4', title: '위생' },
                        { id: '5', title: '약' },
                        { id: '6', title: '치료비' }
                    ]}
                />
            }
        </>
    );
}

export default RegisterConsume;

const styles = StyleSheet.create({
    register: {
        width: "60%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",


        backgroundColor: colors.mid,
        borderRadius: 6,
    },

    // 표
    tableContainer: { marginBottom: 30, backgroundColor: '#fff', marginTop: 5 },
    head: { height: 40, backgroundColor: colors.mid, borderColor: colors.mid, borderWidth: 1, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
    row: { height: 35, borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, borderColor: colors.mid },
    textTitle: { textAlign: 'center', color: colors.white },
    textRow: { textAlign: 'center', color: colors.black }
});