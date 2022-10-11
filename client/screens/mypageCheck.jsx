import { useContext, useEffect, useState } from "react";
import { ListViewBase, StyleSheet, Text, View, ViewPagerAndroidBase } from "react-native";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { checkingMedicine, checkingTeeth } from "../api/dog";
import { weeklyWalkCheck } from "../api/walk";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import Loading from "../customs/loading";


const getLocaleDate = (d) => {
    const checkYear = new Date(d).getFullYear();
    const checkMon = new Date(d).getMonth() + 1;
    const checkDate = new Date(d).getDate();

    return checkYear + "-" + checkMon + "-" + checkDate;
};

const getLastDate = (d) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const lastDay = new Date(d).setHours(0, 0, 0, 0);
    const oneDay = 1000 * 60 * 60 * 24;

    return (today - lastDay) / oneDay;
};



function MypageCheckScreen({ navigation, route }) {
    const [dogData, setDogData] = useState(null);
    const [hasBrush, setHasBrush] = useState(false);
    const [hasTake, setHasTake] = useState(false);
    const [brushGap, setBrushGap] = useState(false);
    const [TakeGap, setTakeGap] = useState(false);
    const [walkCount, setWalkCount] = useState(4);
    const { auth } = useContext(AppContext);
    


    useEffect(() => {
        if(route.params?.currentData) {
            setDogData(route.params.currentData);
    
            const tDay = getLastDate(route.params.currentData.lastTeeth);
            const mDay = getLastDate(route.params.currentData.lastMedicine);

            setBrushGap(tDay);
            setTakeGap(mDay);
            setHasBrush(tDay === 0 ? true : false);
            setHasTake(mDay === 0 ? true : false);
        };

        weeklyWalkCheck(auth.token)
            .then((rcv) => {
                rcv.result ? setWalkCount(rcv.list.length) : console.log(rcv.msg);
            }).catch((err) => {
                console.log(err.message);
            })
    }, [route.params]);


    if (!dogData || !(typeof walkCount === "number")) {
        <Loading />
    } else {
        return (
            <View style={styles.mainBox}>
                <View style={styles.body}>
                    <View style={{ width: 319, alignSelf: "center" }}>
                        <View>
                            <FontText>{dogData.name}의 산책습관</FontText>
                            <View style={styles.outerBar}>
                                <View style={styles.lines}>
                                    {new Array(8).fill(1).map((o, i) => {
                                        return (
                                            <View key={i} style={i === 0 || i === 7 ? [styles.barLine, { width: 0 }] : styles.barLine}>
                                            </View>
                                        );
                                    })}
                                </View>
                                <View style={[styles.innerBar, { width: 45 * walkCount }]}></View>
                            </View>
                            <View style={styles.countBox}>
                                <FontText style={{ fontSize: 18 }}>{walkCount}</FontText>
                                <FontText>/7</FontText>
                            </View>
                        </View>
                        <View>
                            <FontText>{dogData.name}의 양치체크</FontText>
                            <View>
                                {dogData.lastTeeth ?
                                    <FontText>
                                    </FontText>
                                    : <FontText>
                                        아직 양치 체크를 한 적이 없어요!
                                    </FontText>}
                                <Pressable onPress={() => {
                                    checkingTeeth(dogData._id)
                                        .then((rcv) => {
                                            if(rcv.result) {
                                                setBrushGap(0);
                                                setHasBrush(true);
                                            }
                                        }).catch((err) => {
                                            console.log(err.message);
                                        })
                                }}>
                                    <FontText>
                                        오늘의 양치 체크하기
                                    </FontText>
                                </Pressable>
                            </View>
                        </View>
                        <View>
                            <FontText>{dogData.name}의 건강체크</FontText>
                            <View>
                                {dogData.lastMedicine ?
                                    <FontText>


                                    </FontText>
                                    : <FontText>
                                        아직 약을 먹은 적이 없어요!
                                    </FontText>}
                                <Pressable onPress={() => {
                                    checkingMedicine(dogData._id)
                                        .then((rcv) => {
                                            if(rcv.result) {
                                                setTakeGap(0);
                                                setHasTake(true);
                                            }
                                        }).catch((err) => {
                                            console.log(err.message);
                                        })
                                }}>
                                    <FontText>
                                        오늘의 약 체크하기
                                    </FontText>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
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
        borderColor: "black",
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
        backgroundColor: "black",
        width: 1,
        height: "100%"
    },
    innerBar: {
        backgroundColor: "blue",
        height: "100%"
    },
    countBox: {
        flexDirection: "row",
        alignItems: "baseline"
    },

});