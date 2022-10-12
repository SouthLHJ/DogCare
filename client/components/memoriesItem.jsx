import { useContext, useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { checkAuth, deleteMemory, plusViewMemory } from "../api/memories";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

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

                <View style={{ flex: 1, justifyContent :"space-around"}}>
                    <FontText>{item.title}</FontText>
                    <FontText>{item.date.split("T")[0]}</FontText>
                {myMemory ?
                    <View style={styles.iconBox}>
                        <Pressable onPress={() => {
                            navigation.navigate("memoriesWrite", {type: true, item: item})
                        }}>
                            <Feather name="edit" size={18} color="black" />
                        </Pressable>
                        <Pressable onPress={() => {
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
                            <Feather name="trash" size={18} color="black" />
                        </Pressable>
                    </View>
                    : <></>}
                </View>
                <View style={{}}>
                    {item.image ?
                        <Image source={{ uri: item.image }} style={{ height: 78, width: 78, borderRadius: 8 }} />
                        : <></>
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    itemBox: {
        height: 98,
        width: 328,
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

export default MemoriesItem;