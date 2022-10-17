import { useContext, useEffect, useState } from "react";
import { Alert, ListViewBase, StyleSheet, Text, View, ViewPagerAndroidBase, Pressable } from "react-native";
import { checkingMedicine, checkingTeeth, getChecked } from "../api/dog";
import { weeklyWalkCheck } from "../api/walk";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Loading from "../customs/loading";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useIsFocused } from "@react-navigation/native";
import { colors } from "../customs/globalStyle";


const getLocaleDate = (d) => {
    const checkYear = new Date(d).getFullYear();
    const checkMon = new Date(d).getMonth() + 1;
    const checkDate = new Date(d).getDate();

    return checkYear + "-" + checkMon + "-" + checkDate;
};

const getLastDate = (d) => {
    if(d) {
        const today = new Date().setHours(0, 0, 0, 0);
        const lastDay = new Date(d).setHours(0, 0, 0, 0);
        const oneDay = 1000 * 60 * 60 * 24;

        return (today - lastDay) / oneDay;
    } else {
        return null;
    }

};



function MypageCheckScreen({ navigation, route }) {
    const [dogName, setDogName] = useState(null);
    const [dogId, setDogId] = useState(null);
    const [hasBrush, setHasBrush] = useState(false);
    const [hasTake, setHasTake] = useState(false);
    const [brushGap, setBrushGap] = useState(false);
    const [TakeGap, setTakeGap] = useState(false);
    const [walkCount, setWalkCount] = useState([]);
    const [rerender, setRerender] = useState(1);
    const { auth } = useContext(AppContext);
    const isFocused = useIsFocused();


    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => {
                return (
                    <Pressable onPress={() => {
                        navigation.navigate("mypageList");
                    }}>
                        <AntDesign name="left" size={24} color={colors.mid} />
                    </Pressable>
                )
            }
        });
    }, [isFocused]);
 


    useEffect(() => {
        if (route.params || rerender ) {
            setDogId(route.params?.dogId);
            setDogName(route.params?.dogName)
            getChecked(route.params?.dogId ?? dogId)
                .then((rcv) => {
                    if(rcv.result) {
                        const tDay = getLastDate(rcv.data.lastTeeth);
                        const mDay = getLastDate(rcv.data.lastMedicine);
                        
                        setBrushGap(tDay);
                        setTakeGap(mDay);
                        setHasBrush(tDay === 0 ? true : false);
                        setHasTake(mDay === 0 ? true : false);
                    }
                })

        };

        weeklyWalkCheck(auth.token)
            .then((rcv) => {
                rcv.result ? setWalkCount(rcv.list) : console.log(rcv.msg);
            }).catch((err) => {
                console.log(err.message);
            })
    }, [route.params, rerender]);

    return (
        <View style={styles.mainBox}>
            {!dogId ?
                <Loading />
                :
                <View style={styles.body}>
                    <View style={{ width: 319, alignSelf: "center", paddingVertical: 12 }}>
                        <View style={{}}>
                            <FontText title={true} bold={true} style={{ fontSize: 16, marginBottom: 12 }}>{dogName}의 산책습관</FontText>
                            <View style={{top: -18}}>
                            <View style={styles.countBox}>
                                <FontText title={true} bold={true} style={{ fontSize: 24, color: colors.sub }}>{walkCount.length}</FontText>
                                <FontText style={{ fontSize: 16, color: colors.dark }}>/ 7</FontText>
                            </View>
                            <View style={styles.outerBar}>
                                <View style={styles.lines}>
                                    {new Array(8).fill(1).map((o, i) => {
                                        return (
                                            <View key={i} style={i === 0 || i === 7 ? [styles.barLine, { width: 0 }] : styles.barLine}>
                                            </View>
                                        );
                                    })}
                                </View>
                                <View style={[styles.innerBar, { width: 45 * walkCount.length }]}></View>
                            </View>
                            </View>
                        </View>
                        <View style={[styles.hrLine, {marginTop: 0}]}></View>
                        <View>
                            <FontText title={true} bold={true} style={{ fontSize: 16, marginBottom: 12  }}>{dogName}의 치카치카</FontText>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <BouncyCheckbox style={{marginRight: -8}} fillColor={colors.mid} isChecked={hasBrush} disableBuiltInState={true} disabled={hasBrush}
                                    onPress={() => {
                                        Alert.alert("오늘 양치를 한 것으로 체크할까요?", "체크 후 취소가 불가능해요!", [{
                                            text: "아니오",
                                            style: "cancel"
                                        }, {
                                            text: "네!",
                                            onPress: () => {
                                                checkingTeeth(dogId)
                                                    .then((rcv) => {
                                                        if (rcv.result) {
                                                            setBrushGap(0);
                                                            setHasBrush(true);
                                                            setRerender(rerender * -1);
                                                        }
                                                    }).catch((err) => {
                                                        console.log(err.message);
                                                    });
                                            }
                                        }])
                                    }} />
                                {typeof brushGap === "number" ?
                                    <FontText style={{ fontSize: 14 }} title={true}>
                                        {hasBrush ? `오늘 양치를 했어요!` : `마지막으로 약을 먹은 게 ${brushGap}일 전이에요!`}
                                    </FontText>
                                    : <FontText style={{ fontSize: 14 }} title={true}>
                                        {console.log(brushGap)}
                                        아직 양치 체크를 한 적이 없어요!
                                    </FontText>}
                            </View>
                        </View>
                        <View style={styles.hrLine}></View>
                        <View>
                            <FontText title={true} bold={true} style={{ fontSize: 16, marginBottom: 12  }}>{dogName}의 건강체크</FontText>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <BouncyCheckbox style={{marginRight: -8}} fillColor={colors.mid} isChecked={hasTake} disableBuiltInState={true} disabled={hasTake}
                                    onPress={() => {
                                        Alert.alert("오늘 약을 먹은 것으로 체크할까요?", "체크 후 취소가 불가능해요!", [{
                                            text: "아니오",
                                            style: "cancel"
                                        }, {
                                            text: "네!",
                                            onPress: () => {
                                                checkingMedicine(dogId)
                                                    .then((rcv) => {
                                                        if (rcv.result) {
                                                            setTakeGap(0);
                                                            setHasTake(true);
                                                            setRerender(rerender * -1);
                                                        }
                                                    }).catch((err) => {
                                                        console.log(err.message);
                                                    })
                                            }
                                        },]);
                                    }} />
                                {typeof TakeGap === "number" ?
                                    <FontText style={{ fontSize: 14 }} title={true}>
                                        {hasTake ? `오늘 약을 먹었어요!` : `마지막으로 약을 먹은 게 ${TakeGap}일 전이에요!`}
                                    </FontText>
                                    : <FontText style={{ fontSize: 14 }} title={true}>
                                        아직 약을 먹은 적이 없어요!
                                    </FontText>}
                            </View>
                        </View>
                    </View>
                </View>
            }
        </View>
    );
}

export default MypageCheckScreen;

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
    outerBar: {
        borderWidth: 2,
        borderColor: colors.dark,
        borderRadius: 6,
        overflow: "hidden",
        width: 319,
        height: 36
    },
    lines: {
        position: "absolute",
        zIndex: 1000,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    barLine: {
        backgroundColor: colors.dark,
        opacity: 0.5,
        width: 1,
        height: "100%"
    },
    innerBar: {
        backgroundColor: colors.mid,
        height: "100%"
    },
    countBox: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "flex-end",
        margin: 4
    },
    hrLine :{
        height: 1,
        backgroundColor: colors.semi,
        marginVertical: 12 
    },

});