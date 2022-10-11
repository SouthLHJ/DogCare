import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import { getPlaceInfo, likeList } from "../api/place";
import MyPagePlaceItem from "../components/mypagePlcItem";
import { AppContext } from "../contexts/app-context";
import globalStyles from "../customs/globalStyle";
import Loading from "../customs/loading";

function MypageLikePlaceScreen() {
    const navigation = useNavigation();
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
    },[])

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
        <TouchableOpacity onPress={()=>navigation.navigate("mypageList")}>
            <Ionicons name="arrow-back" size={24} color="#0089FF" />
        </TouchableOpacity>
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