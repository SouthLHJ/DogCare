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

    return (
        <View style={styles.itemBox}>
            <View>
                <FontText>{item.date.split("T")[0]}</FontText>
                <FontText>{item.memo}</FontText>
                <View style={styles.iconBox}>
                    <Pressable onPress={() => { setModal(true)}}>
                        <Feather name="edit" size={18} color="black" />
                    </Pressable>
                    <Pressable onPress={() => {
                        Alert.alert(item.title, "해당 산책기록을 삭제하시겠습니까?", [
                            {
                                text: "삭제",
                                onPress: () => {
                                    deleteWalk(item._id)
                                        .then((rcv) => {
                                            if(rcv.result) {
                                                console.log("삭제됨!");
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
                    }}>
                        <Feather name="trash" size={18} color="black" />
                    </Pressable>
                </View>
            </View>
            {modal &&<WalkRegister modal={modal} setModal={setModal} time1={item.time1} time2={item.time2} image={item?.image} memo={item?.memo} edit={true} id={item._id}/> }
            <View style={{ flex: 1, alignItems: "flex-end" }}>
                {item.image ? <Image source={{ uri: item.image }} style={{ height: "100%", width: 78, borderRadius: 8 }} />
                    : <></>
                }
            </View>
        </View>
    );
};
export default WalkItem;

const styles = StyleSheet.create({
    itemBox: {
        height: 86,
        width: 328,
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "#0089FF",
        marginVertical: 8,
        borderRadius: 8,
        padding: 8
    },
    iconBox: {
        flex: 1,
        flexDirection: "row"
    }
})
