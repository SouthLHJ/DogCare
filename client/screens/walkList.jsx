import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { getWalkList } from "../api/walk";
import WalkItem from "../components/walkItem";
import { AppContext } from "../contexts/app-context";
import FontText from "../customs/fontText";
import globalStyles from "../customs/globalStyle";
import Loading from "../customs/loading";

function WalkListScreen() {
    const context = useContext(AppContext);
    const [loaded, setLoaded] = useState(true);

    const [list, setList] = useState([]);

    useEffect(()=>{
        getWalkList(context.auth.token)
            .then((rcv) => {
                if (rcv.result) {
                    console.log(rcv.list)
                    setList(rcv.list);
                } else {
                    Alert.alert("", rcv.msg);
                };
            }).catch((err) => {
                console.log("getWalkList => ",err.message);
            }).finally(() => {
                setLoaded(false);
            });

    },[])

    if(loaded){
        return (
            <Loading />
        )
    }

    return (  
    <View style={globalStyles.container}>
        
        {list.length === 0 ? <FontText style={{textAlign : "center"}}>아직 산책 기록이 없습니다.</FontText>
            :
            <FlatList style={styles.scroll} data={list} renderItem={({ item }) => {
                return <WalkItem item={item}/>
            }} />
        }
    </View>
    );
}

export default WalkListScreen;

const styles = StyleSheet.create({
    
});