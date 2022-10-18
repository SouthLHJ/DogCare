//icon
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getCurrentPositionAsync,useForegroundPermissions,PermissionStatus} from 'expo-location';

import { readWeather } from "../api/walk";
import FontText from "../customs/fontText";
import globalStyles, { colors } from "../customs/globalStyle";
import Loading from "../customs/loading";
import WalkRegister from '../components/walkRegister';
import { latlng_xy_convert } from '../customs/latlng2xy';
import { useIsFocused } from '@react-navigation/native';
import { getDogInfo } from '../api/dog';
import { AppContext } from '../contexts/app-context';


function NewWalkScreen({navigation}) { 
    // Permission 허용받기
    const [locationPermission, requestLocationPermission] = useForegroundPermissions();
    const latRef = useRef();
    const lngRef = useRef();
    const [weather,setWeather] = useState(null);
    const isfocus = useIsFocused();
    const {auth} = useContext(AppContext);


    const time1 = useRef();
    const time2 = useRef();
    const [startIcon, setStartIcon] = useState(false);

    const [modal, setModal] = useState(false);

    const [hasDog, setHasDog] = useState(false);

    useEffect(()=>{ 
        getDogInfo(auth.token)
            .then((rcv) => {
                if (rcv.result) {
                    setHasDog(rcv.data ? true : false);
                } else {
                    console.log(rcv.msg);
                };
            }).catch((err) => {
                console.log("getDog === ", err.message);
            });

        onRefreshWeather();
        async function load(){
            try{
                const start = await AsyncStorage.getItem("walkStart")
                if(start){
                    time1.current = JSON.parse(start);
                    setStartIcon(true)
                }
            }
            catch(e){
                console.log(e.message)
            }
        }
        load();
    },[isfocus])

    //func
    const onWalkingStart = ()=>{
        if(!hasDog) {
            Alert.alert("", "이 기능을 이용하려면 반려견을 등록해야합니다. 등록 페이지로 갈까요?", [{
                text: "확인",
                onPress: () => {
                    navigation.navigate("mypageMain");
                }
            },
        {
            text: "취소",
            style: "cancel"
        }]);

            return;
        }
        if(!startIcon){
            AsyncStorage.setItem("walkStart", JSON.stringify(new Date()));
            time1.current = new Date();
            setStartIcon(true)
        }else{
            return
        }
    }

    const onWalkingStop = async()=>{
        try{
            const start = await AsyncStorage.getItem("walkStart")
            if(start){
                time1.current = new Date(JSON.parse(start)).valueOf();
                time2.current = Date.now();
                AsyncStorage.removeItem("walkStart")
                setStartIcon(false)
                setModal(true)
            }else{
                return
            }
        }catch(e){
            console.log(e.message)
        }

    }
    
    const location = async()=>{
        try{
            if(locationPermission.status === PermissionStatus.UNDETERMINED ||
                locationPermission.status === PermissionStatus.DENIED){
                    const permission = await requestLocationPermission();
                    if(!permission.granted){
                        return ;
                    }
                }
                await takeLatLng();
                onRefreshWeather(1);
        }catch(e){
            console.log("location => ",e)
        }
    }

    let pty = "없음"
    const onRefreshWeather = (t)=>{
        const timeIndex = ["02", "05", "08", "11", "14", "17", "20", "23"];
        const time = `${new Date().getHours()}`.padStart(2,"0")
        const idx = timeIndex.findIndex((one)=>{
            return (one >= time)
        })
        let llxy;
        if(t){
            llxy = latlng_xy_convert("toXY",latRef?.current ?? 126,lngRef?.current ?? 35);
        }
        readWeather(timeIndex[idx-1],llxy?.x ?? 55,llxy?.y ?? 126)
        .then((rcv)=>{
            setWeather(rcv);
        })
        .catch(e=>console.log("readWeather => ",e))
    }

    const takeLatLng = async() =>{
        try{
            const rcv =  await getCurrentPositionAsync();
            latRef.current = rcv.coords.latitude;
            lngRef.current = rcv.coords.longitude;
        }catch(e){
            console.log("takeLatLng =>",e);
        }
    }


    if(!weather){
        return (
            <Loading/>
            )
    }
    switch(weather[6]?.fcstValue){
        case "0":
            pty = <FontAwesome name="sun-o" size={24} color={colors.black} />
            break;
        case "1":
            pty = <MaterialCommunityIcons name="weather-rainy" size={24} color={colors.black} />
            break;
        case "2":
            pty = <MaterialCommunityIcons name="weather-snowy-rainy" size={24} color={colors.black} />
            break;
        case "3":
            pty = <MaterialCommunityIcons name="weather-snowy" size={24} color={colors.black} />
            break;
        case "4":
            pty = <MaterialCommunityIcons name="weather-pouring" size={24} color={colors.black} />
            break;
    }

    return (  
    <View style={globalStyles.container}>
        <View style={{alignItems : "center", marginBottom : 5}}>
            <FontText style={[globalStyles.textTitle,{color : colors.dark}]}>{new Date().getFullYear()}.{`${new Date().getMonth()+1}`.padStart(2,"0")}.{`${new Date().getDate()}`.padStart(2,"0")}</FontText>
        </View>
        <View style={styles.buttonContainer}>
            <View style={styles.weatherContainer}>
                <View style={{flexDirection :"row", alignItems :"center"}}>
                    <FontText style={{marginRight: 6}}>{pty}</FontText>
                    <FontText style={[globalStyles.textNomal,{color : colors.black}]} bold={"semi"}>{weather[0].fcstValue}℃</FontText>
                </View>
                <FontText style={[globalStyles.textNomal,{color : colors.black}]} bold={"semi"}>{weather[9]?.fcstValue}</FontText>
            </View>
        </View>
        <View style={{flexDirection : "row", justifyContent :"flex-end", alignItems : "center", margin: 4}}>
            <FontText style={{fontSize : 10}}>정보제공 : 기상청,</FontText>
            <FontText style={{fontSize : 10}}> 기준 시 : {weather[0].baseTime.slice(0,2)}시</FontText>
            <TouchableOpacity onPress={()=>location()}>
                <MaterialCommunityIcons name="reload" size={15} color="black" />
            </TouchableOpacity>
        </View>
        
        <View style={{flex: 1,alignItems : "center"}}>
            {startIcon ?
            <View style={styles.img}>
                <Image source={require("../assets/puppy.gif")} style={styles.imgInner} resizeMode="contain"/>
            </View>
            :    
            <View style={styles.img}>
                <Image source={require("../assets/puppy_stop.gif")} style={styles.imgInner} resizeMode="contain"/>
            </View>
            }
            {startIcon ?
            <TouchableOpacity style={styles.button} onPress={()=>onWalkingStop()}>
                <FontAwesome name="stop" size={24} color={colors.black} />
            </TouchableOpacity>
            :
            <TouchableOpacity  style={styles.button}  onPress={()=>onWalkingStart()}>
                <AntDesign name="caretright" size={24} color={colors.black} />
            </TouchableOpacity>
            }
        </View>

        
        {modal && <WalkRegister modal={modal} setModal={setModal} time1={time1.current} time2={time2.current}/>}
    </View>
    );
}

export default NewWalkScreen;

const styles = StyleSheet.create({
    weatherContainer :{
        width : "95%",
        flexDirection : "row",
        justifyContent : "space-around",
        alignItems : "center",
        paddingVertical: 10,

        borderTopColor : colors.light,
        borderTopWidth: 2,
        borderBottomColor : colors.light,
        borderBottomWidth: 2,
    },

    img : {
        width  : 280,
        height  : 280,
        marginVertical: 32,
        borderRadius: 12,
        overflow: "hidden",
    },
    imgInner: {
        width: "100%",
        height: "100%"
    },

    buttonContainer :{
        width : "100%",
        alignItems : "center",
    },
    button : {
        padding : 5,
        marginBottom : 10,

        borderColor : colors.black,
        borderRadius : 20,
        borderWidth : 2,
    }
});