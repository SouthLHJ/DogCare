//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dimensions } from 'react-native';
import { colors } from '../customs/globalStyle';
import header from '../customs/header';
const TopTab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();


import NewWalkScreen from '../screens/newWalk';
import WalkListScreen from '../screens/walkList';




function WalkMain() {
    return (
        <TopTab.Navigator screenOptions={{tabBarStyle  :  {display: 'flex' , backgroundColor : "white", height : 55 ,shadowColor : "white", margin: 12, marginBottom: 0, borderTopRightRadius: 12, borderTopLeftRadius: 12, padding: 8}, 
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.sub,
        tabBarLabelStyle :{marginTop : 0, marginLeft : 0},
        tabBarIndicatorStyle: { backgroundColor: colors.sub,width: '46%', height: '90%' , borderRadius : 20, marginBottom : 2 ,marginHorizontal : 2 },
        tabBarIndicatorContainerStyle : {marginTop:2,borderColor : colors.sub, borderWidth : 1, padding : 0, borderRadius : 20, height : 42, margin : 8, marginTop : 8, marginBottom : 0, width : Dimensions.get('screen').width-40},
        tabBarPressColor: colors.sub,
        tabBarPressOpacity: 1,
        }} >
            <TopTab.Screen  name="newWalk" component={NewWalkScreen} options={{title : "산책 하기", }}/>
            <TopTab.Screen  name="walkList" component={WalkListScreen} options={{title : "산책 기록"}}/>
        </TopTab.Navigator>
    );
}

export default WalkMain;