import { useContext, useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import { Ionicons, Feather } from '@expo/vector-icons';
import { deletetDog, getDogInfo } from "../api/dog";
import { useIsFocused } from "@react-navigation/native";
import Loading from "../customs/loading";

function MypageListScreen({ navigation, route }) {
    const [loaded, setLoaded] = useState(false);
    const [myDog, setMyDog] = useState(null);
    const { auth } = useContext(AppContext)
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


    }, [isFocused]);

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


    return (
        <View style={styles.mainBox}>
            <View style={styles.body}>
                {loaded ? <Loading /> : <></>}
                <View>
                    {myDog ?
                        <Pressable style={styles.card} onPress={() => {
                            navigation.navigate("dogRegister", { currentData: myDog, editMode: true });
                        }}>
                            <Image source={{ uri: myDog.image }} style={{ width: 100, height: 100, marginRight: 24, borderRadius: 100, borderWidth: 2, borderColor: "#0089FF" }} resizeMode="center" />
                            <View style={styles.dogInfoBox}>
                                <View style={styles.dogInfoList}>
                                    <FontText style={styles.dogInfoLabel}>이름</FontText>
                                    <FontText>{myDog.name}</FontText>
                                </View>
                                <View style={styles.dogInfoList}>
                                    <FontText style={styles.dogInfoLabel}>나이</FontText>
                                    <FontText>{getDogsYear(myDog.birth)} / {getDogsOlder(myDog.birth)}살</FontText>
                                </View>
                                <View style={styles.dogInfoList}>
                                    <FontText style={styles.dogInfoLabel}>성별</FontText>
                                    <FontText>{genderCheck(myDog.gender)}</FontText>
                                </View>
                                <View style={styles.dogInfoList}>
                                    <FontText style={styles.dogInfoLabel}>특이사항</FontText>
                                    <FontText>{myDog.extra}</FontText>
                                </View>
                            </View>
                                <Pressable style={{ alignSelf: "flex-start", marginVertical: 12 }} onPress={() => {
                                    setLoaded(true);
                                    deletetDog(myDog._id)
                                        .then((rcv) => {
                                            if(rcv.result) {
                                                console.log("삭제");
                                            } else {
                                                console.log(rcv.msg);
                                            };
                                        }).catch((err) => {
                                            console.log(err.message);
                                        }).finally(() => {
                                            setLoaded(false);
                                        });
                                }}>
                                    <Feather name="trash" size={18} color="gray" />
                                </Pressable>
                        </Pressable>
                        : <TouchableOpacity style={styles.addCard} onPress={() => {
                            navigation.navigate("dogRegister");
                        }}>
                            <Ionicons name="add-circle" size={32} color="#0089FF" />
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.listBox}>
                    <TouchableOpacity style={styles.listItem} onPress={() => {
                        if (myDog) {
                            navigation.navigate("checkList", {currentData: myDog});
                        } else {
                            Alert.alert("", "이 기능을 이용하려면 반려견을 등록 해 주세요!");
                        }
                    }}>
                        <FontText style={styles.listText}>내새꾸와의 약속</FontText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listItem} onPress={() => {
                        navigation.navigate("likePlace");
                    }}>
                        <FontText style={styles.listText}>즐겨찾는 곳</FontText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listItem} onPress={() => {
                        navigation.navigate("account");
                    }}>
                        <FontText style={styles.listText}>계정관리</FontText>
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
        borderRadius: 4,
        borderColor: "#0089FF",
        height: 138
    },
    card: {
        margin: 4,
        padding: 6,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 2,
        borderRadius: 4,
        borderColor: "#0089FF",
        height: 138
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
        marginRight: 12,
        fontSize: 14
    },
    listBox: {
        flex: 1,
        flexDirection: "column",
    },
    listItem: {
        paddingVertical: 8,
        backgroundColor: "#DDDDDD",
        marginVertical: 4
    },
    listText: {
        fontSize: 14
    },
});