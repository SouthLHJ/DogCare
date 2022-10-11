//icon
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import { useEffect, useRef, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { readWeather } from "../api/walk";
import FontText from "../customs/fontText";
import globalStyles from "../customs/globalStyle";
import Loading from "../customs/loading";
import WalkRegister from '../components/walkRegister';


function NewWalkScreen() {
    const [weather,setWeather] = useState(null);

    const time1 = useRef();
    const time2 = useRef();
    const [startIcon, setStartIcon] = useState(false);

    const [modal, setModal] = useState(false);

    useEffect(()=>{
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

    },[])

    //func
    const onWalkingStart = ()=>{
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
                console.log("end")
                return
            }
        }catch(e){
            console.log(e.message)
        }

    }
    let pty = "없음"
    const onRefreshWeather = ()=>{
        const timeIndex = ["02", "05", "08", "11", "14", "17", "20", "23"];
        const time = `${new Date().getHours()}`.padStart(2,"0")
        const idx = timeIndex.findIndex((one)=>{
            return (one >= time)
        })

        readWeather(timeIndex[idx-1])
        .then((rcv)=>{
            // console.log(rcv)
            
            setWeather(rcv);
        })
        .catch(e=>console.log("readWeather => ",e))
    }
    if(!weather){
        return (
            <Loading/>
            )
    }
    switch(weather[6]?.fcstValue){
        case "0":
            pty = <MaterialCommunityIcons name="weather-sunny" size={24} color="black" />
            break;
        case "1":
            pty = <MaterialCommunityIcons name="weather-rainy" size={24} color="black" />
            break;
        case "2":
            pty = <MaterialCommunityIcons name="weather-snowy-rainy" size={24} color="black" />
            break;
        case "3":
            pty = <MaterialCommunityIcons name="weather-snowy" size={24} color="black" />
            break;
        case "4":
            pty = <MaterialCommunityIcons name="weather-pouring" size={24} color="black" />
            break;
    }
    
    return (  
    <View style={globalStyles.container}>
        <View style={styles.weatherContainer}>
            <FontText>{pty}</FontText>
            <FontText>{weather[9].fcstValue}</FontText>
            <FontText>{weather[0].fcstValue}℃</FontText>
        </View>
        <FontText style={{textAlign : "right", fontSize : 10}}>출처 : 기상청 , 기준 시간 : {weather[0].baseTime.slice(0,2)}시 </FontText>
        <View style={{height : 400,alignItems : "center"}}>
            {startIcon ?
            <Image source={require("../assets/puppy.gif")} style={styles.img} resizeMode="contain"/>
            :    
            <Image source={require("../assets/puppy_stop.gif")} style={styles.img} resizeMode="contain"/>
            }
        </View>

        <View style={styles.buttonContainer}>
                {startIcon ?
                <TouchableOpacity style={styles.button} onPress={()=>onWalkingStop()}>
                    <FontAwesome name="stop" size={24} color="#0070d1" />
                </TouchableOpacity>
                :
                <TouchableOpacity  style={styles.button}  onPress={()=>onWalkingStart()}>
                    <AntDesign name="caretright" size={24} color="#0070d1" />
                </TouchableOpacity>
                }

        </View>
        <SafeAreaView>
            {modal && <WalkRegister modal={modal} setModal={setModal} time1={time1.current} time2={time2.current}/>}
        </SafeAreaView>
    </View>
    );
}

export default NewWalkScreen;

const styles = StyleSheet.create({
    weatherContainer :{
        flexDirection : "row",
        justifyContent : "space-around",
        alignItems : "center",
        paddingVertical: 7,

        borderColor : "#0070d1",
        borderBottomWidth: 1,
    },

    img : {
        height : 400,
        width  : 300,
    },

    buttonContainer :{
        alignItems : "center"        ,
    },
    button : {
        padding : 5,
        borderColor : "#0070d1",
        borderRadius : 20,
        borderWidth : 2,
    }
});