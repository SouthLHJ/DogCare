import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import FontText from "../customs/fontText";
import globalStyles from "../customs/globalStyle";
import Loading from "../customs/loading";
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from "../contexts/app-context";
import MemoriesItem from "../components/memoriesItem";
import { getMyList } from "../api/memories";

function MemoriesListScreen({navigation, route}) {
    const [loaded, setLoaded] = useState(true);
    const [list, setList] = useState([]);
    const { auth } = useContext(AppContext);

    useEffect(() => {
        console.log(auth)
        getMyList(auth.token)
            .then((rcv) => {
                if(rcv.result) {
                    console.log(rcv.list)
                    setList(rcv.list);
                } else {
                    Alert.alert("", "리스트를 가져오는 데 실패했습니다.");
                };
            }).catch((err) => {
                console.log(err.message);
                Alert.alert("", "리스트를 가져오는 데 실패했습니다.");
            }).finally(() => {
                setLoaded(false);
            });
    }, [])


    return (
        <>
            {loaded ? <Loading /> : <></>}
            <View style={styles.memoriesBox}>
                <Pressable style={[globalStyles.button, styles.button]} onPress={() => {
                    console.log("작성");
                    navigation.navigate("memoriesRegister");
                }}>
                    <MaterialIcons name="add" size={32} color="white" />
                </Pressable>
                <View style={styles.title}>
                    <FontText>우리들의 추억</FontText>
                </View>
                <View style={styles.listBox}>
                    {list.length === 0 ? <FontText>추억을 남겨보세요!</FontText>
                    :
                    <FlatList style={styles.scroll} data={list} renderItem={({item}) => {
                        return <MemoriesItem item={item} />
                    }} />
                    }
                </View>
            </View>
        </>
    );
}

export default MemoriesListScreen;

const styles = StyleSheet.create({
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
        marginVertical: 12,
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
        bottom: 8,
        borderRadius: 100,
        padding: 12,
        elevation: 4
    }
});