//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();
//하단 탭
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const BottomTab = createBottomTabNavigator();

import { StyleSheet, Text, View } from "react-native";

import Header from "../components/header";
import LoginScreen from './login';
import RegisterScreen from './register';
import NewWalkScreen from './newWalk';
import AroundPlaceScreen from './aroundPlace';
import MemoriesListScreen from './memoriesList';
import ConsumeChartScreen from './consumeChart';
import MypageMainScreen from './mypageMain';

function NoneUser (){
    return (
        <>
            <TopTab.Navigator>
                <TopTab.Screen name="login" component={LoginScreen}/>
                <TopTab.Screen name="register" component={RegisterScreen}/>
            </TopTab.Navigator>
        </>
    );
}

function User(){
    return (
        <>
            <BottomTab.Navigator>
                <BottomTab.Screen name="newWalk" component={NewWalkScreen}/>
                <BottomTab.Screen name="aroundPlace" component={AroundPlaceScreen}/>
                <BottomTab.Screen name="memoriesList" component={MemoriesListScreen}/>
                <BottomTab.Screen name="consumeChart" component={ConsumeChartScreen}/>
                <BottomTab.Screen name="mypageMain" component={MypageMainScreen}/>
            </BottomTab.Navigator>
        </>
    )
}


function MainScreen() {

    return (  
    <View style={styles.container}>
        <Header />
        {true ? <NoneUser />: <User/>}
        
    </View>
    );
}

export default MainScreen;

const styles = StyleSheet.create({
    container :{
        flex : 1,
    }
});