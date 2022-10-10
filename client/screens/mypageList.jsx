import { useContext, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import { Ionicons } from '@expo/vector-icons';
import { getDogInfo } from "../api/dog";

function MypageListScreen({navigation, route}) {
    const {dispatch, auth} = useContext(AppContext);
    const [myDog, setMyDog] = useState(null);


    useEffect(() => {
        getDogInfo(auth.token)
            .then((rcv) => {
                if(rcv.result){
                    setMyDog(rcv.data);
                } else {
                    console.log(rcv.msg);
                };
            }).catch((err) => {
                console.log("getDog === ", err.message);
            });


    }, []);

    //func
    const sendLogout = ()=>{
        dispatch({type: "logout"})
    }

    return (  
        <View style={styles.mainBox}>
    <View style={styles.body}>
        <View>
            {myDog ? 
            <Pressable style={styles.card} onPress={() => {
                navigation.navigate("dogRegister", {dog: myDog});
            }}>
                <Image source={{uri: myDog.image}}/>
                <View style={styles.dogInfoBox}> 
                    <FontText>이름</FontText>
                    <FontText>나이</FontText>
                    <FontText>성별</FontText>
                    <FontText>특이사항</FontText>
                </View>
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
                navigation.navigate("checkList");
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
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderRadius: 4,
        borderColor: "#0089FF",
        height: 138
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