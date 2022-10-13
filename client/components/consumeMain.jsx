//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConsumeContextProvider } from '../contexts/consume-context';
import { colors } from '../customs/globalStyle';
import header from '../customs/header';
const TopTab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

import ConsumeChartScreen from '../screens/consumeChart';
import ConsumeListScreen from '../screens/consumeList';
import ConsumeRegisterScreen from '../screens/consumeRegister';
import Header from './header';


function ConsumeInner() {
    return(
        <ConsumeContextProvider>
            <TopTab.Navigator  screenOptions={{tabBarStyle  :  {display: 'flex' , backgroundColor : "white", height : 40 ,shadowColor : "white"}, 
                tabBarActiveTintColor: colors.white,
                tabBarInactiveTintColor: colors.sub,
                tabBarLabelStyle :{marginTop : 0, marginLeft : 0},
                tabBarIndicatorStyle: { backgroundColor: colors.sub,width: '48%', height: '90%' , borderRadius : 20, marginBottom : 2 ,marginHorizontal : 2 },
                tabBarIndicatorContainerStyle : {marginTop:2,borderColor : colors.sub, borderWidth : 1, padding : 0, borderRadius : 20, height : 40},
                tabBarPressColor: colors.sub,
                tabBarPressOpacity: 1,
            }}>
                <TopTab.Screen  name="consumeChart" component={ConsumeChartScreen} options={{title : "목록"}}/>
                <TopTab.Screen  name="consumeRegister" component={ConsumeRegisterScreen} options={{title : "관리"}}/>
            </TopTab.Navigator>
        </ConsumeContextProvider>
    )
}


function ConsumeMain() {
    return (
        <Stack.Navigator screenOptions={{headerBackVisible: false, headerStyle: {backgroundColor: colors.main}, headerTitleAlign: "center", headerTitle: header}} animationEnabled={false}>
            <Stack.Screen name="consumeInner" component={ConsumeInner} />
        </Stack.Navigator>
    );
}

export default ConsumeMain