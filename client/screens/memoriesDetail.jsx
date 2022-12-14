import { Ionicons, AntDesign } from '@expo/vector-icons';

import { useIsFocused, useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { readUserId } from "../api/account";
import { getList, writeComment } from '../api/comment';
import { addCommentMemory, heartReq, updateHeartMemory } from "../api/memories";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import globalStyles, { colors } from "../customs/globalStyle";
import Loading from "../customs/loading";

function MemoriesDetailScreen({ navigation }) {
    const { auth } = useContext(AppContext);
    const route = useRoute();

    const [hide, setHide] = useState(false);
    const [item, setItem] = useState();
    const [name, setName] = useState();
    const [reload, setReload] = useState(1);
    const [liked, setLiked] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState(null);
    const isfocus = useIsFocused();


    useEffect(() => {
        if (route.params) {
            setLiked(route.params.item.heart.includes(auth.id));
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
                        setCommentList(rcv.list.reverse());
                    } else {
                        console.log(rcv.msg);
                    };
                }).catch((err) => {
                    console.log(err.message);
                });
        }
    }, [isfocus, reload]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => {
                return (
                    <Pressable onPress={() => {
                        navigation.navigate("memoriesList");
                    }}>
                        <AntDesign name="left" size={24} color={colors.mid} />
                    </Pressable>
                )
            }
        });
    }, [isfocus]);


    //func
    const onHeart = (checking) => {
        console.log(item._id, auth.id, checking)
        heartReq(item._id, auth.id, checking)
            .then((rcv) => {
                setLiked(checking)
            }).catch((err) => {
                console.log(err.message);
            });
    }

    const onComment = () => {
        if(!comment){
            return
        }else if(comment.trim().length === 0){
            return
        }else{
            const trimComment = comment.trim()
            writeComment(auth.token, item._id, trimComment)
                .then((rcv) => {
                    setReload(reload * -1);
                    setComment("");
                }).catch((err) => {
                    console.log("writeComment => ", err);
                })
        }
    }
    
    // ????????? ?????? ??????
    Keyboard.addListener("keyboardDidShow", () => setHide(true))
    Keyboard.addListener("keyboardDidHide", () => setHide(false))

    return (
        <View style={[globalStyles.container, styles.container]}>
            <TouchableWithoutFeedback delayPressIn={300000} delayPressOut={300000}
                onPress={() => { Platform.OS === "ios" ? Keyboard.dismiss() : null }}
            >
                {hide ?
                    <></>
                    :
                    <View >
                        <View style={styles.titleBox}>
                            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                                <FontText title={true} bold={true} style={[globalStyles.textTitle]}>{item?.title}</FontText>
                                <FontText style={styles.textSmall}>/ {item?.date.split("T")[0]}</FontText>
                            </View>
                            <FontText style={[globalStyles.textNomal, styles.textName]}>{name}</FontText>
                        </View>
                        {item?.public &&
                            <View style={styles.recordBox}>
                                <View>
                                    <FontText style={styles.textSmall}>View : {item?.view ?? 0}</FontText>
                                </View>
                                <View>
                                    <FontText style={styles.textSmall}>????????? : {item?.heart?.length ?? 0}</FontText>
                                </View>
                                <View>
                                    <FontText style={styles.textSmall}>?????? : {commentList?.length ?? 0}</FontText>
                                </View>
                                <View>
                                    {liked ?
                                        <TouchableOpacity onPress={() => onHeart(false)}>
                                            <Ionicons name="heart-sharp" size={18} color={colors.sub} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => onHeart(true)}>
                                            <Ionicons name="heart-outline" size={18} color={colors.sub} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        }

                        <View style={{ backgroundColor: colors.light, borderRadius: 6, margin: 12, padding: 8 }}>
                            {item?.image ?
                                <Image source={{ uri: item?.image }} style={styles.image} resizeMode='cover' />
                                : <></>
                            }
                            <View style={styles.descriptionBox}>
                                <FontText title={true} style={[globalStyles.textNomal]}>{item?.description}</FontText>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                {item?.public ? <FontText title={true} style={styles.textSmall}>?????????</FontText> : <FontText title={true} style={styles.textSmall}>????????????</FontText>}
                            </View>
                        </View>
                    </View>
                }
            </TouchableWithoutFeedback>

            <View >


            </View>
            <View style={styles.commentInputBox}>
                <TextInput style={{ flex: 1 }}
                    onChangeText={(text) => { setComment(text) }} value={comment} placeholder="????????? ??????????????????."
                />
                <TouchableOpacity style={styles.commentRegister} onPress={() => onComment()}>
                    <FontText style={[globalStyles.textNomal, { color: "white" }]}>??????</FontText>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginTop: 14, paddingHorizontal: 12 }}>
                <FlatList data={commentList}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.commentBox}>
                                <View style={styles.commentUser}>
                                    <FontText style={{ fontSize: 14 }}>{item.userName}</FontText>
                                </View>
                                <View style={styles.commentDesc}>
                                    <FontText style={{ fontSize: 14, textAlign: "justify", lineHeight: 16 }}>{item.comment}</FontText>
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
        </View>
    );
}

export default MemoriesDetailScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        marginTop: 12,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
    },
    titleBox: {
        borderBottomWidth: 1,
        borderBottomColor: colors.main,
        paddingBottom: 5,
        marginBottom: 5,
        marginHorizontal: 4
    },
    textName: {
        color: "gray",
        margin: 4
    },
    recordBox: {
        flexDirection: "row",
        paddingHorizontal: 5,
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "space-between"
    },
    image: {
        width: "98%",
        height: 180,
        borderRadius: 8,
        marginVertical: 4,
        alignSelf: "center",
    },
    descriptionBox: {
        width: "98%",
        alignSelf: "center",
        marginBottom: 4,
        marginTop: 8,
        backgroundColor: "white",
        borderRadius: 6,
        padding: 8
    },
    textSmall: {
        fontSize: 12,
        margin: 4
    },
    commentInputBox: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.mid,
        padding: 6,
        paddingBottom: 4,
        marginTop: 5
    },
    commentRegister: {
        width: 50,
        marginLeft: 10,
        alignItems: "center",
        backgroundColor: colors.mid,
        borderRadius: 100,
        padding: 4,
        paddingVertical: 8
    },
    commentBox: {
        marginBottom: 8
    },
    commentUser: {
    },
    commentDesc: {
        backgroundColor: colors.light,
        borderRadius: 8,
        padding: 6,
        paddingVertical: 8,
        marginTop: 4,
        marginHorizontal: 4,
        alignSelf: "flex-start"
    }

});