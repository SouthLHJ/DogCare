import { Ionicons, AntDesign } from '@expo/vector-icons';

import { useIsFocused, useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable } from "react-native";
import { readUserId } from "../api/account";
import { getList, writeComment } from '../api/comment';
import { addCommentMemory, heartReq, updateHeartMemory } from "../api/memories";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import globalStyles, { colors } from "../customs/globalStyle";
import Loading from "../customs/loading";

function MemoriesDetailScreen({navigation}) {
    const { auth } = useContext(AppContext);
    const route = useRoute();
    const [item, setItem] = useState();
    const [name, setName] = useState();
    const [reload, setReload] = useState(1);
    const [liked, setLiked] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState();
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
                        setCommentList(rcv.list);
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
                            <AntDesign name="left" size={24} color={colors.white} />
                        </Pressable>
                )
            }
        });
    }, [isfocus]);


    //func
    const onHeart = (checking) => {
        console.log(item._id, auth.id, checking )
        heartReq(item._id, auth.id, checking)
            .then((rcv) => {
                setLiked(checking)
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
                <View style={{flexDirection:"row", alignItems: "baseline"}}>
                <FontText title={true} bold={true} style={[globalStyles.textTitle]}>{item?.title}</FontText>
                <FontText style={styles.textSmall}>/ {item?.date.split("T")[0]}</FontText>
                </View>
                <FontText style={[globalStyles.textNomal, styles.textName]}>{name}</FontText>
            </View>
            <View style={styles.recordBox}>
                <View>
                    <FontText style={styles.textSmall}>View : {item?.view ?? 0}</FontText>
                </View>
                <View>
                    <FontText style={styles.textSmall}>좋아요 : {item?.heart?.length ?? 0}</FontText>
                </View>
                <View>
                    <FontText style={styles.textSmall}>댓글 : {item?.comment?.length ?? 0}</FontText>
                </View>
                <View>
                    {liked ?
                            <TouchableOpacity onPress={() => onHeart(false)}>
                                <Ionicons name="heart-sharp" size={18} color={colors.mid} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => onHeart(true)}>
                                <Ionicons name="heart-outline" size={18} color={colors.mid} />
                            </TouchableOpacity>
                    }
                </View>
            </View>

            <View style={{backgroundColor: colors.light, borderRadius: 6, margin: 12, padding: 8}}>
            {item?.image ?
                <Image source={{ uri: item?.image }} style={styles.image} resizeMode='cover' />
                : <></>
            }
            <View style={styles.descriptionBox}>
                <FontText title={true} style={[globalStyles.textNomal]}>{item?.description}</FontText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
                {item?.public && <FontText style={styles.textSmall}>공개글</FontText>}
            </View>
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
                                            <FontText style={{fontSize: 14}}>{item.userName}</FontText>
                                        </View>
                                        <View style={styles.commentDesc}>
                                        <FontText style={{fontSize: 14, textAlign: "justify", lineHeight: 16}}>{item.comment}</FontText>
                                        </View>
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
    container: {
        paddingHorizontal: 10
    },
    titleBox: {
        borderBottomWidth: 1,
        borderBottomColor: colors.main,
        paddingBottom: 5,
        marginBottom: 5
    },
    textName: {
        color: "gray"
    },
    recordBox: {
        flexDirection: "row",
        paddingHorizontal: 5,
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "space-between"
    },
    image: {
        width: 320,
        height: 180,
        borderRadius: 8,
        marginVertical: 4,
        alignSelf: "center",
    },
    descriptionBox: {
        width: 320,
        alignSelf: "center",
        marginBottom: 4,
        marginTop: 8,
        backgroundColor: "white",
        borderRadius: 6,
        padding: 8
    },
    textSmall: {
        fontSize: 12
    },
    commentInputBox: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.sub,
        padding: 6,
        paddingBottom: 4,
        marginTop: 5
    },
    commentRegister: {
        width: 50,
        marginLeft: 10,
        alignItems: "center",
        backgroundColor: colors.sub,
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
        backgroundColor: "#DDD",
        borderRadius: 8,
        padding: 6,
        paddingVertical: 8,
        marginTop: 4,
        marginHorizontal: 4,
        alignSelf: "flex-start"
    }

});