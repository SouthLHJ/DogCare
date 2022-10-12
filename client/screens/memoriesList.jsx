import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import FontText from "../customs/fontText";
import globalStyles, { colors } from "../customs/globalStyle";
import Loading from "../customs/loading";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { AppContext } from "../contexts/app-context";
import MemoriesItem from "../components/memoriesItem";
import { getAllList, getMyList } from "../api/memories";
import { useIsFocused } from "@react-navigation/native";
import SwitchSelector from "react-native-switch-selector"

function MemoriesListScreen({ navigation, route }) {
    const [refresh, setRefresh] = useState(1);
    const [loaded, setLoaded] = useState(true);
    const [list, setList] = useState([]);
    const [listType, setListType] = useState("my");
    const { auth } = useContext(AppContext);
    const isFocused = useIsFocused();

    useEffect(() => {
        // console.log(auth);

        if (listType === "all") {
            getAllList(auth.token)
                .then((rcv) => {
                    if (rcv.result) {
                        // console.log(rcv.list)
                        setList(rcv.list);
                    } else {
                        Alert.alert("", rcv.msg);
                    };
                }).catch((err) => {
                    console.log(err.message);
                    Alert.alert("", "리스트를 가져오는 데 실패했습니다. 2");
                }).finally(() => {
                    setLoaded(false);
                });
        } else {
            getMyList(auth.token)
                .then((rcv) => {
                    if (rcv.result) {
                        // console.log(rcv.list)
                        setList(rcv.list);
                    } else {
                        Alert.alert("", "리스트를 가져오는 데 실패했습니다. 01");
                    };
                }).catch((err) => {
                    console.log(err.message);
                    Alert.alert("", "리스트를 가져오는 데 실패했습니다. 02");
                }).finally(() => {
                    setLoaded(false);
                });
        };

    }, [listType, refresh, isFocused])


    return (
        <>
            {loaded ? <Loading /> : <></>}
            <View style={styles.memoriesBox}>
                <Pressable style={[globalStyles.button, styles.button]} onPress={() => {
                    // console.log("작성");
                    navigation.navigate("memoriesWrite");
                }}>
                    <MaterialIcons name="add" size={32} color="white" />
                </Pressable>
                {/* <View style={styles.title}>
                    <FontText>우리들의 추억</FontText>
                </View> */}
                <View style={styles.listBox}>
                    <View style={styles.chooseList}>
                            <SwitchSelector
                            initial={0}
                            onPress={value => setListType(value)}
                            textColor={colors.sub}
                            selectedColor={colors.white}
                            buttonColor={colors.sub}
                            borderColor={colors.sub}
                            hasPadding
                            options={[
                                { label: "우리의 이야기", value: "my" },
                                { label: "모두의 이야기", value: "all" }, 
                            ]}
                            testID="listType-switch-selector"
                            accessibilityLabel="listType-switch-selector"
                          />
                    </View>
                    {list.length === 0 ? <FontText>추억을 남겨보세요!</FontText>
                        :
                        <FlatList style={styles.scroll} data={list} renderItem={({ item }) => {
                            return <MemoriesItem item={item} onRefresh={() => {
                                setRefresh(refresh * -1);
                            }} />
                        }} />
                    }
                </View>
            </View>
        </>
    );
}

export default MemoriesListScreen;

const styles = StyleSheet.create({
    chooseList: {
        width: "100%",
        padding: 12,
    },
    memoriesBox: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        margin: 12
    },
    title: {

    },
    listBox: {
        flex: 1,
        alignContent: "center",
        backgroundColor: "white",
        justifyContent: "center",
        marginVertical: 0,
        borderRadius: 12,
        width: "100%",
        alignItems: "center"
    },
    scroll: {
        flex: 1,
        flexDirection: "column",

    },
    button: {
        zIndex: 10000,
        position: 'absolute',
        height: 56,
        width: 56,
        right: 12,
        bottom: 12,
        borderRadius: 100,
        padding: 12,
        elevation: 4,
        backgroundColor: colors.sub
    }
});