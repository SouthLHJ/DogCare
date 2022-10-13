//상단 탭
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
//하단 탭
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const BottomTab = createBottomTabNavigator();

import { StyleSheet, Text, View } from "react-native";

//icon
import { FontAwesome5, FontAwesome, MaterialIcons } from '@expo/vector-icons';

import LoginScreen from './login';
import RegisterScreen from './register';
import AroundPlaceScreen from './aroundPlace';
import MypageMainScreen from '../components/mypageMain';
import WalkMain from '../components/walkMain';
import MemoriesMain from '../components/memoriesMain';
import ConsumeMain from '../components/consumeMain';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/app-context';
import FontText from '../customs/fontText';
import { colors } from '../customs/globalStyle';

function NoneUser (){
    const {main, white} = colors;
    return (
        <>
            <Stack.Navigator screenOptions={{tabBarStyle  :  {display: 'none'}, headerStyle: {backgroundColor: main}, headerTitleAlign: "center", headerBackVisible: false , swipeEnabled : false, headerTitle: () => {
                return (<View style={{ alignItems: "center", justifyContent: "center",  flexDirection: "row"}}>
                <FontAwesome name="heart" size={18} color={white} />
                    <FontText title={true} style={{fontSize: 24, color: white}}>
                        내새꾸
                    </FontText>
                    <FontAwesome name="heart" size={18} color={white} />
                </View>)
            }}}>
                <Stack.Screen name="login" component={LoginScreen}/>
                <Stack.Screen name="register" component={RegisterScreen}/>
            </Stack.Navigator>
        </>
    );
}

function User(){
    const {main, white} = colors;
    return (
        <>
            <BottomTab.Navigator screenOptions={{tabBarActiveTintColor:main, headerShown : false, unmountOnBlur: true, headerStyle: {backgroundColor: main}, headerTitleAlign: "center", headerTitle: () => {
                return (<View style={{flex: 1, alignItems: "center", justifyContent: "center",  flexDirection: "row"}}>
                <FontAwesome name="heart" size={18} color={white} />
                    <FontText title={true} bold={true} style={{fontSize: 24, color: white}}>
                        내새꾸
                    </FontText>
                    <FontAwesome name="heart" size={18} color={white} />
                </View>)
            }}} initialRouteName="memoriesMain">
                <BottomTab.Screen name="walkRecordMain" component={WalkMain} options={{title :"산책",tabBarIcon :({color})=>{return <FontAwesome5 name="walking" size={24} color={color} />} }}/>
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
        context.auth?.token ? setUser(true) : setUser(false);
    },[context.auth])

    return (  
    <View style={styles.container}>
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