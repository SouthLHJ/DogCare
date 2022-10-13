import { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { searchCode } from "../api/dog";
import CustomButton from "../customs/customButton";
import FontText from "../customs/fontText";
import { colors } from "../customs/globalStyle";

function CodeModal({ visible, setDatas, closeModal }) {
    const [ownerName, setOwnerName] = useState(null);
    const [ownerBirth, setOwnerBirth] = useState(null);
    const [regNo, setRegNo] = useState(null);
    const [rfid, setRfid] = useState(null);
    const [hasData, setHasData] = useState(null);


    return (
        <Modal visible={visible} transparent={true} animationType="slide" >
            <Pressable style={styles.body} onPress={() => {
                closeModal();
            }} >
                <Pressable style={styles.sub}>
                    <View style={styles.label}>
                        <FontText title={true} bold={true}>보호자 이름</FontText>
                        </View>
                    <TextInput style={styles.input} value={ownerName} placeholder="보호자 이름 또는 생년월일 중 하나 필수" onChangeText={(text) => {
                        setOwnerName(text);
                    }} />
                    <View style={styles.label}>
                        <FontText title={true} bold={true}>보호자 생년월일</FontText>
                        </View>
                    <TextInput style={styles.input} value={ownerBirth} placeholder="보호자 이름 또는 생년월일 중 하나 필수" onChangeText={(text) => {
                        setOwnerBirth(text);
                    }} />
                    <View style={styles.label}>
                        <FontText title={true} bold={true}>반려견 등록번호</FontText>
                        </View>
                    <TextInput style={styles.input} value={regNo} placeholder="반려견 등록번호 또는 RFID 중 하나 필수" onChangeText={(text) => {
                        setRegNo(text);
                    }} />
                    <View style={styles.label}>
                        <FontText title={true} bold={true}>반려견 RFID</FontText>
                        </View>
                    <TextInput style={styles.input} value={rfid} placeholder="반려견 등록번호 또는 RFID 중 하나 필수" onChangeText={(text) => {
                        setRfid(text);
                    }} />

                    <View style={styles.buttonBox}>
                        <FontText style={{color: hasData? "green" : "red", marginVertical: 18}}>{hasData ? "등록번호 확인에 성공하였습니다." : "등록번호를 검색 해 주세요."}</FontText>
                        { hasData ? 
                        <CustomButton onPress={() => closeModal()}>확인</CustomButton>
                        : <CustomButton onPress={() => {
                            if(!ownerName && !ownerBirth) {
                                Alert.alert("" , "등록번호 확인을 위해서는 소유자의 이름 또는 생년월일이 필요합니다.");
                                return;
                            } else if (!regNo && !rfid) {
                                Alert.alert("", "등록번호 확인을 위해서는 반려견의 등록번호 또는 RFID 코드가 필요합니다.");
                                return;
                            } else if(!(regNo.length === 15) || !(rfid.length === 15)) {
                                Alert.alert("", "등록번호 또는 RFID 코드는 15자리여야만 합니다.");
                            } else {
                                const sendData = {
                                    regNo: regNo,
                                    rfid: rfid,
                                    ownerName: ownerName,
                                    ownerBirth: ownerBirth
                                };

                                searchCode(sendData)
                                    .then((rcv) => {
                                        console.log(rcv);
                                        if(rcv.result) {
                                            setHasData(true);
                                            setDatas({
                                                code: rcv.item.dogRegNo,
                                                gender: rcv.item.neuterYn === "미중성" ? "_" : "" + rcv.item.sexNm === "암컷" ? "female" : "male" ,
                                                name: rcv.item.dogNm,
                                                species: rcv.item.kindNm
                                            });
                                        } else {
                                            console.log(rcv.msg);
                                        };
                                    }).catch((err) => {
                                        console.log(err.message);
                                    })
                            }
                        }}>검색</CustomButton>}
                    </View>
                </Pressable>

            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    sub: {
        width: 320,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: colors.main,
        borderRadius: 18,
        padding: 18
    },
    buttonBox: {
        alignItems: 'center'
    },
    label: {
        borderBottomWidth: 1,
        borderBottomColor: colors.dark,
        fontSize: 16,
        margin: 4,
        marginTop: 12,
        color: colors.dark,
        alignSelf: "flex-start",
        marginVertical: 8

    },
    inputBox: {
        width: "100%",
        marginVertical: 4
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "gray",
        padding: 6,
        paddingHorizontal: 8,
        height: 32,
        justifyContent: "center",
    },
})

export default CodeModal;