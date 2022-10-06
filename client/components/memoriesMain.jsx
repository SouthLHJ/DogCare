//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();

import MemoriesDetailScreen from '../screens/memoriesDetail';
import MemoriesListScreen from '../screens/memoriesList';
import MemoriesRegisterScreen from '../screens/memoriesRegister';


function MemoriesMain() {
    return (  
        <TopTab.Navigator screenOptions={{tabBarStyle  :  {display: 'none'}}}>
            <TopTab.Screen  name="memoriesList" component={MemoriesListScreen}/>
            <TopTab.Screen  name="memoriesRegister" component={MemoriesRegisterScreen}/>
            <TopTab.Screen  name="memoriesDetail" component={MemoriesDetailScreen}/>
        </TopTab.Navigator>
    );
}

export default MemoriesMain;