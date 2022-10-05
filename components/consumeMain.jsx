//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();

import ConsumeChartScreen from '../screens/consumeChart';
import ConsumeListScreen from '../screens/consumeList';
import ConsumeRegisterScreen from '../screens/consumeRegister';



function ConsumeMain() {
    return (  
        <TopTab.Navigator screenOptions={{tabBarStyle  :  {display: 'none'}}}>
            <TopTab.Screen  name="consumeChart" component={ConsumeChartScreen}/>
            <TopTab.Screen  name="consumeList" component={ConsumeListScreen}/>
            <TopTab.Screen  name="consumeRegister" component={ConsumeRegisterScreen}/>
        </TopTab.Navigator>
    );
}

export default ConsumeMain