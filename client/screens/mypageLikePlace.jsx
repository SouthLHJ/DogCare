import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useContext, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import { getPlaceInfo, likeList } from "../api/place";
import MyPagePlaceItem from "../components/mypagePlcItem";
import { AppContext } from "../contexts/app-context";
import globalStyles, { colors } from "../customs/globalStyle";
import Loading from "../customs/loading";

function MypageLikePlaceScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const context = useContext(AppContext);
    const [likePlace , setLikePlace] =useState();
    const [list, setList]=useState();

    useEffect(()=>{

        likeList(context.auth.id)
        .then((rcv)=>{
            if(rcv.result){
                setLikePlace(rcv.list);
            }else{
                console.log("likeList server =>",rcv.msg)

            }
        })
        .catch(err=>console.log("likeList =>",err))

        navigation.setOptions({
            headerLeft: () => {
                return (
                    <Pressable onPress={() => {
                        navigation.navigate("mypageList")
                    }}>
                        <AntDesign name="left" size={24} color={colors.white} />
                    </Pressable>
                )
            }
        });
    },[route.params])

    useEffect(()=>{
        if(likePlace){
            getPlaceInfo(likePlace)
                .then((rcv)=>{
                    // console.log(rcv)
                    setList(rcv)
                })
                .catch(err => console.log("getPlaceInfo =>",err))
        }
        // console.log(list)
    },[likePlace])

    if(!list){
        return (
            <Loading/>
        )
    }


    return (  
    <View style={globalStyles.container}>
        <View style={{flex : 1, justifyContent : "flex-start"}}>
            <FlatList 
                data={list} renderItem={({ item }) => {
                return <MyPagePlaceItem item={item} />}}
            />
        </View>
    </View>
    );
}

export default MypageLikePlaceScreen;

const styles = StyleSheet.create({
    
});