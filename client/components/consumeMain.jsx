//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ConsumeContextProvider } from '../contexts/consume-context';
const TopTab = createMaterialTopTabNavigator();

import ConsumeChartScreen from '../screens/consumeChart';
import ConsumeListScreen from '../screens/consumeList';
import ConsumeRegisterScreen from '../screens/consumeRegister';



function ConsumeMain() {
    return (
        <ConsumeContextProvider>
            <TopTab.Navigator screenOptions={{tabBarStyle  :  {display: 'flex'}}}>
                <TopTab.Screen  name="consumeChart" component={ConsumeChartScreen} options={{title : "차트"}}/>
                <TopTab.Screen  name="consumeList" component={ConsumeListScreen} options={{title : "리스트"}}/>
                <TopTab.Screen  name="consumeRegister" component={ConsumeRegisterScreen} options={{title : "관리"}}/>
            </TopTab.Navigator>
        </ConsumeContextProvider>
    );
}

export default ConsumeMain