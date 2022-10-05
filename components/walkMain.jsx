//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();


import NewWalkScreen from '../screens/newWalk';
import WalkListScreen from '../screens/walkList';


function WalkMain() {
    return (  
        <TopTab.Navigator screenOptions={{tabBarStyle  :  {display: 'flex'}}}>
            <TopTab.Screen  name="newWalk" component={NewWalkScreen} options={{title : "산책 하기"}}/>
            <TopTab.Screen  name="walkList" component={WalkListScreen} options={{title : "산책 기록"}}/>
        </TopTab.Navigator>
    );
}

export default WalkMain;