import { useContext, useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { checkAuth, deleteMemory } from "../api/memories";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import WalkRegister from "./walkRegister";
import { deleteWalk } from "../api/walk";

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
            <View style={[styles.itemBox]}>
                <View style={{flex :1,justifyContent : "space-between"}}>
                    <View>
                        <FontText>{item.date.split("T")[0]}</FontText>
                    </View>
                    <View>
                        <FontText>{((item.time2-item.time1)/(1000*60*60)).toFixed(0)}시간 {((item.time2-item.time1)/(1000*60)).toFixed(0)}분 {((item.time2-item.time1)/(1000)).toFixed(0)}초</FontText>
                    </View>
                    <View style={styles.iconBox}>
                        <Pressable onPress={() => { setModal(true)}}>
                            <Feather name="edit" size={18} color="black" />
                        </Pressable>
                        <Pressable onPress={() =>onDelete()}>
                            <Feather name="trash" size={18} color="black" />
                        </Pressable>
                    </View>
                </View>
                <View style={{flex :1}}>
                    <FontText>{item.memo}</FontText>
                </View>
                {modal &&<WalkRegister modal={modal} setModal={setModal} time1={item.time1} time2={item.time2} image={item?.image} memo={item?.memo} edit={true} id={item._id}/> }
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                    {item.image ? <Image source={{ uri: item.image }} style={{ height: "100%", width: 78, borderRadius: 8 }} />
                        : <></>
                    }
                </View>
            </View>
        </View>
    );
};
export default WalkItem;

const styles = StyleSheet.create({
    container : {alignItems : "center"},
    itemBox: {
        height: 86,
        width: "98%",
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "#0089FF",
        marginVertical: 8,
        borderRadius: 8,
        padding: 8
    },
    iconBox: {
        flexDirection: "row"
    }
})
