import { useContext, useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import { deletetDog, getDogInfo } from "../api/dog";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Loading from "../customs/loading";
import globalStyles, { colors } from "../customs/globalStyle";

function MypageListScreen({ navigation, route }) {
    const [loaded, setLoaded] = useState(false);
    const [myDog, setMyDog] = useState(null);
    const { auth, dispatch } = useContext(AppContext)
    const [rerender, setRerender] = useState(1);
    const isFocused = useIsFocused();


    useEffect(() => {
        getDogInfo(auth.token)
            .then((rcv) => {
                if (rcv.result) {
                    setMyDog(rcv.data);
                } else {
                    console.log(rcv.msg);
                };
            }).catch((err) => {
                console.log("getDog === ", err.message);
            });
        navigation.setOptions({
            headerRight: () => {
                return (
                    <Pressable onPress={() => onLogout()}>
                        <FontAwesome name="sign-out" size={24} color={colors.mid} />
                    </Pressable>
                )
            }
        });

    }, [isFocused, rerender]);

    const getDogsOlder = (dogsBirth) => {
        const now = Date.now();
        const dogsNow = new Date(dogsBirth).getTime();
        const gap = now - dogsNow;
        const dogsYear = 1000 * 60 * 60 * 24 * 73;

        return (gap / dogsYear).toFixed(0);
    };

    const getDogsYear = (dogsBirth) => {
        const now = new Date();
        const dogsNow = new Date(dogsBirth);

        if (now.getFullYear() === dogsNow.getFullYear()) { // 년도가 바뀌지 않은 채 나이 계산
            return (now.getMonth() - dogsNow.getMonth()) + "개월"
        } else if (now.getFullYear() === dogsNow.getFullYear() + 1 || now.getMonth() < dogsNow.getMonth()) { // 년도는 바뀌었지만 1년이 지나지 않음
            return (12 - dogsNow.getMonth() + now.getMonth()) + "개월";
        } else if (now.getMonth() < dogsNow.getMonth()) { // 년도 바뀌고, 월은 지나지 않음
            const year = now.getFullYear() - dogsNow.getFullYear() + 1;
            const mon = 11 - dogsNow.getMonth() + now.getMonth()
            return year + "년 " + mon + "개월";
        } else {
            const year = now.getFullYear() - dogsNow.getFullYear();
            const mon = dogsNow.getMonth() + now.getMonth() - dogsNow.getMonth()
            return year + "년" + (mon ? mon + " 개월" : "");
        };
    };

    const genderCheck = (g) => {
        const checking = {
            _male: "수컷(중성화)",
            male: "수컷",
            _female: "암컷(중성화)",
            female: "암컷",
            unknown: "모름",
        };

        return checking[g];
    }

    const onLogout = ()=>{
        Alert.alert(
            "","로그아웃 하시겠습니까?",[{
                text : "취소"
            },{
                text : "확인", onPress : ()=>dispatch({type:"logout"})
            }]
        )
    }


    return (
        <View style={styles.mainBox}>
            <View style={styles.body}>
                {loaded ? <Loading /> : <></>}
                <View>
                    {myDog ?
                        <Pressable style={styles.card} onPress={() => {
                            navigation.navigate("dogRegister", { currentData: myDog, editMode: true });
                        }}>
                            <Image source={{ uri: myDog.image }} style={{ width: 100, height: 100, marginRight: 24, borderRadius: 100, borderWidth: 1, borderColor: colors.semi, }} resizeMode="center" />
                            <View style={styles.dogInfoBox}>
                                <View style={styles.dogInfoList}>
                                    <FontText title={true} bold={true} style={styles.dogInfoLabel}>이름</FontText>
                                    <FontText>{myDog.name}</FontText>
                                </View>
                                <View style={styles.dogInfoList}>
                                    <FontText title={true} bold={true} style={styles.dogInfoLabel}>나이</FontText>
                                    <FontText>{getDogsYear(myDog.birth)} / {getDogsOlder(myDog.birth)}살</FontText>
                                </View>
                                <View style={styles.dogInfoList}>
                                    <FontText title={true} bold={true} style={styles.dogInfoLabel}>성별</FontText>
                                    <FontText>{genderCheck(myDog.gender)}</FontText>
                                </View>
                                <View style={styles.dogInfoList}>
                                    <FontText title={true} bold={true} style={styles.dogInfoLabel}>특이사항</FontText>
                                    <FontText>{myDog.extra}</FontText>
                                </View>
                            </View>
                                <Pressable style={{ alignSelf: "flex-start", marginVertical: 12 }} onPress={() => {
                                    Alert.alert("'" + myDog.name + "' 의 등록을 취소하겠습니까?", "산책기록과 추억 기록은 지워지지 않고 남아있게 됩니다.", [{
                                        text: "확인",
                                        onPress: () => {
                                            setLoaded(true);
                                            deletetDog(myDog._id)
                                                .then((rcv) => {
                                                    if(rcv.result) {
                                                        setRerender(rerender * -1);
                                                    } else {
                                                        console.log(rcv.msg);
                                                    };
                                                }).catch((err) => {
                                                    console.log(err.message);
                                                }).finally(() => {
                                                    setLoaded(false);
                                                });
                                        }
                                    }, {
                                        text: "취소",
                                        style: "cancel"
                                    }])
                                }}>
                                    <Feather name="trash" size={18} color="gray" />
                                </Pressable>
                        </Pressable>
                        : <TouchableOpacity style={styles.addCard} onPress={() => {
                            navigation.navigate("dogRegister");
                        }}>
                            <Ionicons name="add-circle" size={32} color={colors.sub} />
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.listBox}>
                    <TouchableOpacity style={styles.listItem} onPress={() => {
                        if (myDog) {
                            navigation.navigate("checkList", {dogId: myDog._id, dogName: myDog.name});
                        } else {
                            Alert.alert("", "이 기능을 이용하려면 반려견을 등록해야합니다.");
                        }
                    }}>
                        <FontText bold="semi" style={styles.listText}>내새꾸와의 약속</FontText>
                    </TouchableOpacity>
                    <View style={styles.listDiv}>
                    </View>
                    <TouchableOpacity style={styles.listItem} onPress={() => {
                        navigation.navigate("likePlace");
                    }}>
                        <FontText bold="semi" style={styles.listText}>즐겨찾는 곳</FontText>
                    </TouchableOpacity>
                    <View style={styles.listDiv}>
                    </View>
                    <TouchableOpacity style={styles.listItem} onPress={() => {
                        navigation.navigate("account");
                    }}>
                        <FontText bold="semi" style={styles.listText}>계정관리</FontText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default MypageListScreen;

const styles = StyleSheet.create({
    mainBox: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        margin: 12,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 8
    },
    body: {
        flex: 1,
        width: "100%",
        flexDirection: "column",
    },
    addCard: {
        margin: 4,
        padding: 6,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderRadius: 8,
        borderColor: colors.sub,
        height: 138
    },
    card: {
        margin: 4,
        padding: 6,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 8,
        height: 138,
        backgroundColor: colors.light
    },
    dogInfoBox: {
        flex: 1
    },
    dogInfoList: {
        flexDirection: "row",
        marginVertical: 2,
        alignItems: "center"
    },
    dogInfoLabel: {
        borderBottomWidth: 1,
        borderBottomColor: colors.dark,
        marginRight: 12,
        fontSize: 14,
        marginVertical: 2
    },
    listBox: {
        flex: 1,
        flexDirection: "column",
        marginHorizontal: 12
    },
    listItem: {
        paddingVertical: 18,
        marginVertical: 4
    },
    listText: {
        fontSize: 16,
    },
    listDiv: {
        height: 1,
        backgroundColor: colors.light
    },
});