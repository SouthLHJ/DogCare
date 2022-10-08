//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();

import MypageCheckScreen from '../screens/mypageCheck';
import MypageListScreen from '../screens/mypageList';
import MypagePetRegisterScreen from '../screens/mypagePetRegister';
import MypageLikePlaceScreen from '../screens/mypageLikePlace';
import MypageAccountScreen from '../screens/mypageAccount';



function MypageMain() {
    return (  
        <TopTab.Navigator screenOptions={{tabBarStyle  :  {display: 'none'}, swipeEnabled: false}} animationEnabled={false}>
            <TopTab.Screen name="mypageList" component={MypageListScreen}/>
            <TopTab.Screen name="dogRegister" component={MypagePetRegisterScreen}/>
            <TopTab.Screen name="checkList" component={MypageCheckScreen}/>
            <TopTab.Screen name="likePlace" component={MypageLikePlaceScreen}/>
            <TopTab.Screen name="account" component={MypageAccountScreen}/>
        </TopTab.Navigator>
    );
}

export default MypageMain;