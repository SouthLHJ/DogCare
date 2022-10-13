import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useContext, useEffect, useState } from "react";
import { Alert, Image, ImageBackground, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { createStaticMapURI, likeAdd } from "../api/place";
import { AppContext } from '../contexts/app-context';
import FontText from "../customs/fontText";
import { colors } from "../customs/globalStyle";
import PlaceInfoModal from "./placeInfoModal";
// item.geometry.location.lat/lng
function MyPagePlaceItem({item}) {
    const navigation = useNavigation();
    const {auth} = useContext(AppContext)

    const [mapURI, setMapURI] = useState("");
    const [likeCheck, setLikecheck] = useState(true);
    const [modal, setModal]  = useState(false);
    const [day, setDay] = useState(0);

    useEffect(()=>{
        const resMapUri = createStaticMapURI(item.geometry.location.lat,item.geometry.location.lng);
        setMapURI(resMapUri);
    },[])

    let leftIcon = null;
    if(day>0){
        leftIcon = (
            <Pressable onPress={()=>{
                if(day > 0){
                    setDay(day-1)
                }else{
                    setDay(0)
                }
            }}>
                <AntDesign name="left" size={15} color={colors.dark} />
            </Pressable>
        )
    }
    let rightIcon = null ;
    if(day<6){
        rightIcon = (
            <Pressable onPress={()=>{
                if(day < 6){
                    setDay(day+1)
                }else{
                    setDay(6)
                }
            }}>
                <AntDesign name="right" size={15} color={colors.dark} />
            </Pressable>
        )
    }

    return (  
        <>
        <View style={styles.itemBox}>
            <View style={{flex :2,justifyContent : "space-between"}}>
                <TouchableOpacity onPress={()=>setModal(true)}>
                    <View style={{flexDirection : "row", alignItems: "baseline", margin: 4,}}>
                        <FontText style={styles.titleText} title={true} bold={true}>{item.name}</FontText>
                    </View>
                    <View style={{flexDirection : "row", alignItems: "baseline", margin: 4,}}>
                        <FontText style={styles.text}>{item?.formatted_address}</FontText>
                    </View>
                    <View style={{flexDirection : "row", alignItems: "baseline", margin: 4,}}>
                        <FontText style={styles.text}>{item?.formatted_phone_number}</FontText>
                    </View>
                </TouchableOpacity>
                {item?.opening_hours ?
                <View style = {{flexDirection : "row", alignItems : "center"}}>
                    {leftIcon}
                    <FontText style={styles.text}>{item?.opening_hours?.weekday_text[day]}</FontText>
                    {rightIcon}
                </View>    
                :
                <FontText style={styles.text}>영업시간 미등록</FontText>
                }
            </View>
            <TouchableOpacity style={{ flex: 1, alignItems: "flex-end" }} onPress={()=>setModal(true)}>
                {mapURI ?
                <ImageBackground source={{ uri: mapURI }} style={{ height: "100%", width: "100%", borderRadius: 8 }} >
                    <Pressable style={styles.mapLike} onPress={() => {
                        likeAdd(auth.id, item.place_id, likeCheck ? false : true)
                        .then((rcv) => {
                            if(rcv.result) {
                                setLikecheck(likeCheck ? false : true)
                                navigation.navigate("likePlace",{refresh : 1})
                            } else {
                                Alert.alert("" , rcv.msg);
                            };
                        }).catch((err) => {
                            Alert.alert("ERROR", "");
                            console.log("likecheckError   ===   " + err.message);
                        });
                    }}>
                        {likeCheck ? 
                        <View >
                            <AntDesign name="star" size={28} color="#F7C447" />
                        </View>
                        : <View >
                            <AntDesign name="staro" size={28} color="gray" />
                        </View>
                        }
                    </Pressable>
                </ImageBackground>
                    : <></>
                }
            </TouchableOpacity>
        </View>
            <PlaceInfoModal currentCoords={item.geometry.location} item_id={item?.place_id} visible={modal} onCloseModal={() => {
                setModal(false);
            }} />
        </>
    );
}

export default MyPagePlaceItem;
 
const styles = StyleSheet.create({
    titleText :{
        fontSize: 18, marginRight: 4
    },
    text :{

    },
    itemBox: {
        flexDirection :"row",
        height: 140,
        width : "100%",
        borderWidth: 3,
        borderColor: "white",
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.light
    },
    iconBox: {
        flexDirection: "row"
    },
    mapLike: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
});