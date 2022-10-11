import { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { searchCode } from "../api/dog";
import CustomButton from "../customs/customButton";
import FontText from "../customs/fontText";

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
                    <TextInput style={styles.input} value={ownerName} onChangeText={(text) => {
                        setOwnerName(text);
                    }} />
                    <TextInput style={styles.input} value={ownerBirth} onChangeText={(text) => {
                        setOwnerBirth(text);
                    }} />
                    <TextInput style={styles.input} value={regNo} onChangeText={(text) => {
                        setRegNo(text);
                    }} />
                    <TextInput style={styles.input} value={rfid} onChangeText={(text) => {
                        setRfid(text);
                    }} />

                    <View style={styles.buttonBox}>
                        <FontText style={{color: hasData? "green" : "red"}}>{hasData ? "등록번호 확인에 성공하였습니다." : "등록번호를 검색 해 주세요."}</FontText>
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
        alignItems: "center"
    },
    sub: {
        width: 320,
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "#0089FF",
        borderRadius: 18,
        padding: 18
    },
    input: {
        borderWidth: 1,
        borderColor: "black",
        margin: 8,
        borderRadius: 8,
        padding: 4
    },
    buttonBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        alignItems: "center",
        marginTop: 18
    },
})

export default CodeModal;