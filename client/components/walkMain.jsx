//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../customs/globalStyle';
import header from '../customs/header';
const TopTab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();


import NewWalkScreen from '../screens/newWalk';
import WalkListScreen from '../screens/walkList';


function WalkInner() {
    return(
        <TopTab.Navigator screenOptions={{tabBarStyle  :  {display: 'flex' , backgroundColor : "white", height : 40 ,shadowColor : "white"}, 
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.sub,
        tabBarLabelStyle :{marginTop : 0, marginLeft : 0},
        tabBarIndicatorStyle: { backgroundColor: colors.sub,width: '48%', height: '90%' , borderRadius : 20, marginBottom : 2 ,marginHorizontal : 2 },
        tabBarIndicatorContainerStyle : {marginTop:2,borderColor : colors.sub, borderWidth : 1, padding : 0, borderRadius : 20, height : 40},
        tabBarPressColor: colors.sub,
        tabBarPressOpacity: 1,
        }} >
            <TopTab.Screen  name="newWalk" component={NewWalkScreen} options={{title : "산책 하기", }}/>
            <TopTab.Screen  name="walkList" component={WalkListScreen} options={{title : "산책 기록"}}/>
        </TopTab.Navigator>
    )
}


function WalkMain() {
    return (
        <Stack.Navigator screenOptions={{headerBackVisible: false, headerStyle: {backgroundColor: colors.main}, headerTitleAlign: "center", headerTitle: header}} animationEnabled={false}>
            <Stack.Screen name='walkInner' component={WalkInner} />
        </Stack.Navigator>
    );
}

export default WalkMain;