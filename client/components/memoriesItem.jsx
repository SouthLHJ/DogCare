import { useContext, useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { checkAuth, deleteMemory, plusViewMemory } from "../api/memories";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { colors } from "../customs/globalStyle";

function MemoriesItem({ item, onRefresh }) {
    const [myMemory, setMyMemory] = useState(false);
    const { auth } = useContext(AppContext);
    const navigation = useNavigation();

    useEffect(() => {
        checkAuth(auth.token, item.userId)
            .then((rcv) => {
                if (rcv.result) {
                    setMyMemory(rcv.checked);
                    // console.log(rcv)
                } else {
                    console.log(rcv.msg);
                }
            }).catch((err) => {
                console.log(err.message);
            })
    }, [item])

    //func
    const moveDetail = ()=>{
        plusViewMemory(item._id,{ view : item?.view ?? 0})
         .then((rcv)=>{
            if(rcv.result){

            }else{
                console.log("moveDetail  server= >",rcv.msg)
            }
            // console.log(rcv)
         })
         .catch(err => console.log("moveDetail =>",err))
        navigation.navigate("memoriesDetail",{item : item})
    }

    return (
        <View style={styles.itemBox}>
            <TouchableOpacity style={{flex : 1, flexDirection : "row"}} onPress={()=>moveDetail()}>
                <View style={{flexDirection: "row", alignItems: "baseline", margin: 4}}>
                    <FontText title={true} style={{fontSize: 24, marginRight: 8}}>{item.title}</FontText>
                    <FontText style={{color: colors.dark}}>/ {((item.date.split("T")[0]).replace("-", ".")).replace("-", ".")}</FontText>
                    
                </View>
            {myMemory ?
                <View style={styles.iconBox}>
                    <View style={[styles.icon, {marginRight: 12}]}>
                    <Pressable style={{flexDirection: "row", alignItems: "baseline"}} onPress={() => {
                        navigation.navigate("memoriesWrite", {type: true, item: item})
                    }}>
                        <Feather name="edit" size={20} color={colors.dark} />
                        <FontText bold={true} style={{color: colors.dark, fontSize: 14}}>수정</FontText>
                    </Pressable>
                    </View>
                    <View style={[styles.icon, {marginRight: 8}]}>
                    <Pressable style={{flexDirection: "row", alignItems: "baseline"}} onPress={() => {
                        Alert.alert(item.title, "해당 추억을 삭제하시겠습니까?", [
                            {
                                text: "삭제",
                                onPress: () => {
                                    deleteMemory(item._id)
                                        .then((rcv) => {
                                            if(rcv.result) {
                                                console.log("삭제됨!");
                                            } else {
                                                console.log(rcv.msg);
                                            }
                                        }).catch((err) => {
                                            console.log(err.message);
                                        });
                                        onRefresh();
                                }
                            }
                        ])
                    }}>
                        <Feather name="trash" size={20} color={colors.dark} />
                        <FontText bold={true} style={{color: colors.dark, fontSize: 14}}>삭제</FontText>
                        </Pressable>
                    </View>
                    : <></>}
                </View>
                <View>
                {item.image ?
                    <Image source={{ uri: item.image }} style={{ height: 88, width: 88, borderRadius: 8, marginLeft: 12 }}  />
                    : <View style={{height: 88, width: 88, borderRadius: 8, marginLeft: 12}}></View>
                }
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    itemBox: {
        height: 108,
        width: 342,
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "white",
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.light
    },
    iconBox: {
        flex: 1,
        flexDirection: "row",
        margin: 4,
    },
    icon: {
        justifyContent: "flex-end"
    }
})

export default MemoriesItem;