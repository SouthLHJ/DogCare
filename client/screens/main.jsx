//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();
//하단 탭
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const BottomTab = createBottomTabNavigator();

import { StyleSheet, Text, View } from "react-native";

//icon
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import Header from "../components/header";
import LoginScreen from './login';
import RegisterScreen from './register';
import AroundPlaceScreen from './aroundPlace';
import MypageMainScreen from './mypageMain';
import WalkMain from '../components/walkMain';
import MemoriesMain from '../components/memoriesMain';
import ConsumeMain from '../components/consumeMain';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/app-context';

function NoneUser (){
    return (
        <>
            <TopTab.Navigator screenOptions={{tabBarStyle  :  {display: 'none'} , swipeEnabled : false}}>
                <TopTab.Screen name="login" component={LoginScreen}/>
                <TopTab.Screen name="register" component={RegisterScreen}/>
            </TopTab.Navigator>
        </>
    );
}

function User(){
    return (
        <>
            <BottomTab.Navigator screenOptions={{tabBarActiveTintColor:"#0089FF", headerShown : false, unmountOnBlur: true}}>
                <BottomTab.Screen name="walkMain" component={WalkMain} options={{title :"산책",tabBarIcon :({color})=>{return <FontAwesome5 name="walking" size={24} color={color} />} }}/>
                <BottomTab.Screen name="aroundPlace" component={AroundPlaceScreen} options={{title :"장소",tabBarIcon :({color})=>{return <FontAwesome name="map" size={18}  color={color}  />} }}/>
                <BottomTab.Screen name="memoriesMain" component={MemoriesMain}options={{title :"추억",tabBarIcon :({color})=>{return <MaterialIcons name="history-edu" size={24} color={color} />} }}/>
                <BottomTab.Screen name="consumeMain" component={ConsumeMain}options={{title :"소비",tabBarIcon :({color})=>{return <FontAwesome name="dollar" size={24} color={color} />} }}/>
                <BottomTab.Screen name="mypageMain" component={MypageMainScreen}options={{title :"마이페이지",tabBarIcon :({color})=>{return <FontAwesome name="user" size={24}  color={color} />} }}/>
            </BottomTab.Navigator>
        </>
    )
}


function MainScreen() {
    const context = useContext(AppContext);

    const [user, setUser] = useState(false);

    useEffect(()=>{
        context.auth?.token && setUser(true);
    },[context.auth])

    return (  
    <View style={styles.container}>
        <Header />
        {user ? <User/>: <NoneUser /> }
        
    </View>
    );
}

export default MainScreen;

const styles = StyleSheet.create({
    container :{
        flex : 1,
    }
});