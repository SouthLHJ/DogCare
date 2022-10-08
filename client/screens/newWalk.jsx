//icon
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

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
        const timeIndex = ["02", "05", "08", "11", "14", "17", "20", "23"];
        const time = `${new Date().getHours()}`.padStart(2,"0")
        const idx = timeIndex.findIndex((one)=>{
            return (one >= time)
        })

        readWeather(timeIndex[idx-1])
        .then((rcv)=>{
            // console.log(rcv)
            setWeather(rcv)
        })
        .catch(e=>console.log("readWeather => ",e))
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

    if(!weather){
        return (
            <Loading/>
        )
    }
    
    return (  
    <View style={globalStyles.container}>
        <View style={styles.weatherContainer}>
            <FontText>{weather.weather}</FontText>
            <FontText>{weather.heat}</FontText>
        </View>
        <View style={{height : 400,alignItems : "center"}}>
            <Image source={require("../assets/puppy.gif")} style={styles.img} resizeMode="contain"/>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={()=>onWalkingStart()}>
                {startIcon ? <AntDesign name="pause" size={24} color="black" />:<AntDesign name="caretright" size={24} color="black" />}
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>onWalkingStop()}>
                <FontAwesome name="stop" size={24} color="black" />
            </TouchableOpacity>
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

        padding: 10,

        borderColor: "black",
        borderWidth: 1,
    },

    img : {
        height : 400,
        width  : 300,
    },

    buttonContainer :{
        flexDirection : "row",
        justifyContent : "space-around",

    }
});