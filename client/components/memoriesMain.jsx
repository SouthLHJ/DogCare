//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();

import MemoriesDetailScreen from '../screens/memoriesDetail';
import MemoriesListScreen from '../screens/memoriesList';
import MemoriesWriteScreen from '../screens/memoriesWrite';


function MemoriesMain() {
    return (  
        <TopTab.Navigator screenOptions={{tabBarStyle  :  {display: 'none'},swipeEnabled : false}} >
            <TopTab.Screen  name="memoriesList" component={MemoriesListScreen}/>
            <TopTab.Screen  name="memoriesWrite" component={MemoriesWriteScreen}/>
            <TopTab.Screen  name="memoriesDetail" component={MemoriesDetailScreen}/>
        </TopTab.Navigator>
    );
}

export default MemoriesMain;