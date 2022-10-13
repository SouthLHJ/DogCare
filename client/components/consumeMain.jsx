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
            <TopTab.Navigator screenOptions={{tabBarStyle  :  {display: 'flex'}, }}>
                <TopTab.Screen  name="consumeChart" component={ConsumeChartScreen} options={{title : "목록"}}/>
                <TopTab.Screen  name="consumeRegister" component={ConsumeRegisterScreen} options={{title : "관리"}}/>
            </TopTab.Navigator>
        </ConsumeContextProvider>
    )
}


function ConsumeMain() {
    return (
        <Stack.Navigator screenOptions={{headerBackVisible: false, headerStyle: {backgroundColor: colors.main}, headerTitleAlign: "center", headerTitle: header}} animationEnabled={false}>
            <Stack.Screen name="consumeMain" component={ConsumeInner} />
        </Stack.Navigator>
    );
}

export default ConsumeMain