import { useContext, useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { checkAuth, deleteMemory } from "../api/memories";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import WalkRegister from "./walkRegister";
import { deleteWalk } from "../api/walk";
import { colors } from "../customs/globalStyle";

function WalkItem({ item, onRefresh }) {
    const navigation = useNavigation();

    const [modal, setModal] = useState(false);
    
    //func
    const onDelete = ()=>{
        Alert.alert(item.title, "해당 산책기록을 삭제하시겠습니까?", [
            {
                text : "취소"
            },
            {
                text: "삭제",
                onPress: () => {
                    deleteWalk(item._id)
                    .then((rcv) => {
                        if(rcv.result) {
                            onRefresh();
                        } else {
                            console.log("deleteWalk server =>",rcv.msg);
                        }
                    }).catch((err) => {
                        console.log("deleteWalk =>",err.message);
                    });
                }
            }
        ])
    }
    return (
        <View style={styles.container}>
            <View style={[styles.itemBox, item?.memo || item?.image ? {height: item.memo.length > 20 || item?.image ? 140 : 112 } : {}]}>
                <View style={{flexDirection : "row", alignItems: "baseline", margin: 4,}}>
                    <FontText title={true} bold={true} style={{ fontSize: 18, marginRight: 4 }}>산책 </FontText>
                    <FontText style={{ color: colors.dark }}>/ {item.date.split("T")[0]} / </FontText>
                    { ((item.time2-item.time1)/(1000*60*60)).toFixed(0) != 0 && <FontText> {((item.time2-item.time1)/(1000*60*60)).toFixed(0)}시간</FontText>}
                    { ((item.time2-item.time1)/(1000*60)).toFixed(0) != 0 && <FontText> {((item.time2-item.time1)/(1000*60)).toFixed(0)}분</FontText>}
                    <FontText style={{ color: colors.dark }}> {((item.time2-item.time1)/(1000)).toFixed(0)}초</FontText>
                </View>
                <View style={{flexDirection :"row", flex : 1}}>
                        {item.image ? 
                    <View style={{width : "30%", alignItems: "flex-start" }}>
                        <Image source={{ uri: item.image }} style={{ height: "100%", width: "100%", borderRadius: 8 }} />
                    </View>
                            : <></>
                        }
                    <View style={{flex :2, margin: 8}}>
                        <ScrollView style={{height : "90%"}}>
                            <FontText title={true} bold={true} style={{ color: colors.black, fontSize: 14 }}>{item.memo}</FontText>
                        </ScrollView>
                        <View style={{alignItems: "flex-end"}}>
                            <View style={styles.iconBox}>
                                <Pressable style={{ flexDirection: "row", alignItems: "baseline" }}  onPress={() => { setModal(true)}}>
                                    <Feather name="edit" size={18} color={colors.dark} />
                                    <FontText bold={true} style={{ color: colors.dark, fontSize: 14, marginRight: 8 }}>수정</FontText>
                                </Pressable>
                                <Pressable style={{ flexDirection: "row", alignItems: "baseline" }} onPress={() =>onDelete()}>
                                    <Feather name="trash" size={18} color={colors.dark} />
                                    <FontText bold={true} style={{ color: colors.dark, fontSize: 14 }}>삭제</FontText>
                                </Pressable>
                            </View>
                        </View>
                        {modal &&<WalkRegister modal={modal} setModal={setModal} time1={item.time1} time2={item.time2} image={item?.image} memo={item?.memo} edit={true} id={item._id}/> }
                    </View>
                </View>
            </View>
        </View>
    );
};
export default WalkItem;

const styles = StyleSheet.create({
    container : {alignItems : "center"},
    itemBox: {
        height: 112,
        width : "100%",
        borderWidth: 3,
        borderColor: "white",
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.light
    },
    iconBox: {
        flexDirection: "row",
    }
})
