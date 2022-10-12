import { Ionicons } from '@expo/vector-icons';

import { useIsFocused, useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { readUserId } from "../api/account";
import { getList, writeComment } from '../api/comment';
import { addCommentMemory, heartReq, updateHeartMemory } from "../api/memories";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import globalStyles, { colors } from "../customs/globalStyle";
import Loading from "../customs/loading";

function MemoriesDetailScreen() {
    const { auth } = useContext(AppContext);
    const route = useRoute();
    const [item, setItem] = useState();
    const [name, setName] = useState();
    const [reload, setReload] = useState(1);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState();
    const isfocus = useIsFocused();


    useEffect(() => {
        if (route.params) {
            // console.log(route.params?.item.userId)
            setItem({ ...route.params?.item })
            readUserId(route.params?.item.userId)
                .then((rcv) => {
                    if (rcv.result) {
                        setName(rcv.data.name);
                    } else {
                        console.log("memoriesDetail readUserId  server = > ", rcv.msg);
                    };
                })
                .catch((err) => console.log("memoriesDetail readUserId = > ", err));

            getList(route.params?.item._id)
                .then((rcv) => {
                    if (rcv.result) {
                        setCommentList(rcv.list);
                    } else {
                        console.log(rcv.msg);
                    };
                }).catch((err) => {
                    console.log(err.message);
                });
        }
    }, [isfocus, reload])

    //func
    const onHeart = (checking) => {
        heartReq(item._id, auth.id, checking)
            .then((rcv) => {
                setReload(reload * -1);
            }).catch((err) => {
                console.log(err.message);
            });
    }

    const onComment = () => {
        writeComment(auth.token, item._id, comment)
            .then((rcv) => {
                setReload(reload * -1);
                setComment("");
            }).catch((err) => {
                console.log("writeComment => ", err);
            })
    }

    return (
        <View style={[globalStyles.container, styles.container]}>
            <View style={styles.titleBox}>
                <FontText style={[globalStyles.textTitle]} bold={"extra"}>{item?.title}</FontText>
                <FontText style={[globalStyles.textNomal, styles.textName]}>{name}</FontText>
            </View>
            <View style={styles.recordBox}>
                <View style={{ width: "25%" }}>
                    <FontText style={styles.textSmall}>View : {item?.view ?? 0}</FontText>
                </View>
                <View style={{ width: "25%" }}>
                    <FontText style={styles.textSmall}>좋아요 : {item?.heart?.length ?? 0}</FontText>
                </View>
                <View style={{ width: "25%" }}>
                    <FontText style={styles.textSmall}>댓글 : {item?.comment?.length ?? 0}</FontText>
                </View>
                <View style={{ width: "25%", alignItems: "flex-end" }}>
                    {item?.heart ?
                        (item.heart.includes(auth.id) ?
                            <TouchableOpacity onPress={() => onHeart(false)}>
                                <Ionicons name="heart-sharp" size={15} color={colors.sub} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => onHeart(true)}>
                                <Ionicons name="heart-outline" size={15} color={colors.sub} />
                            </TouchableOpacity>
                        )
                        : <></>
                    }
                </View>
            </View>


            {item?.image ?
                <Image source={{ uri: item?.image }} style={styles.image} resizeMode='contain' />
                : <></>
            }
            <View style={styles.descriptionBox}>
                <FontText style={[globalStyles.textNomal]}>{item?.description}</FontText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
                <FontText style={styles.textSmall}>{item?.date.split("T")[0]}</FontText>
                {item?.public && <FontText style={styles.textSmall}>공개글</FontText>}
            </View>

            <View>
                <View style={styles.commentInputBox}>
                    <TextInput style={{ flex: 1 }}
                        onChangeText={(text) => { setComment(text) }} value={comment}
                    />
                    <TouchableOpacity style={styles.commentRegister} onPress={() => onComment()}>
                        <FontText style={[globalStyles.textNomal, { color: "white" }]}>등록</FontText>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }}>
                        <FlatList data={commentList}
                            renderItem={({ item }) => {
                                return (
                                    <View style={styles.commentBox}>
                                        <View style={styles.commentUser}>
                                            <FontText>{item.userName}</FontText>
                                        </View>
                                        <FontText>{item.comment}</FontText>
                                    </View>
                                )
                            }}
                        />
                </View>
            </View>
        </View>
    );
}

export default MemoriesDetailScreen;

const styles = StyleSheet.create({
    container: { paddingHorizontal: 10 },
    titleBox: { borderBottomWidth: 1, borderBottomColor: "#0089FF", paddingBottom: 5, marginBottom: 5 },
    textName: { color: "gray" },
    recordBox: { flexDirection: "row", paddingHorizontal: 5, marginBottom: 5, alignItems: "flex-end" },
    image: { height: "30%", width: "100%", borderRadius: 8, marginVertical: 5 },
    descriptionBox: { marginTop: 5 },
    textSmall: { fontSize: 10 },
    commentInputBox: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "rgba(0, 136, 255, 0.51)", paddingBottom: 3, marginTop: 5 },
    commentRegister: { width: 50, marginLeft: 10, alignItems: "center", backgroundColor: "rgba(0, 136, 255, 0.51)", borderRadius: 10, padding: 3 },
    commentBox: { flexDirection: "row", width: "100%" },
    commentUser: { width: 90 },

});