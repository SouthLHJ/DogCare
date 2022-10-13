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
        <TopTab.Navigator screenOptions={{tabBarStyle  :  {display: 'flex'}}}>
            <TopTab.Screen  name="newWalk" component={NewWalkScreen} options={{title : "산책 하기"}}/>
            <TopTab.Screen  name="walkList" component={WalkListScreen} options={{title : "산책 기록"}}/>
        </TopTab.Navigator>
    )
}


function WalkMain() {
    return (
        <Stack.Navigator screenOptions={{headerBackVisible: false, headerStyle: {backgroundColor: colors.main}, headerTitleAlign: "center", headerTitle: header}} animationEnabled={false}>
            <Stack.Screen name='walkMain' component={WalkInner} />
        </Stack.Navigator>
    );
}

export default WalkMain;