//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Stack = createNativeStackNavigator();

import MypageCheckScreen from '../screens/mypageCheck';
import MypageListScreen from '../screens/mypageList';
import MypagePetRegisterScreen from '../screens/mypagePetRegister';
import MypageLikePlaceScreen from '../screens/mypageLikePlace';
import MypageAccountScreen from '../screens/mypageAccount';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../customs/globalStyle';
import header from '../customs/header';



function MypageMain() {
    return (  
        <Stack.Navigator screenOptions={{headerBackVisible: false, headerStyle: {backgroundColor: "white"}, headerTitleAlign: "center", headerTitle: header}} animationEnabled={false}>
            <Stack.Screen name="mypageList" component={MypageListScreen}/>
            <Stack.Screen name="dogRegister" component={MypagePetRegisterScreen}/>
            <Stack.Screen name="checkList" component={MypageCheckScreen}/>
            <Stack.Screen name="likePlace" component={MypageLikePlaceScreen}/>
            <Stack.Screen name="account" component={MypageAccountScreen}/>
        </Stack.Navigator>
    );
}

export default MypageMain;