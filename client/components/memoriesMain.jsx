//상단 탭
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../customs/globalStyle';
import header from '../customs/header';
const Stack = createNativeStackNavigator();

import MemoriesDetailScreen from '../screens/memoriesDetail';
import MemoriesListScreen from '../screens/memoriesList';
import MemoriesWriteScreen from '../screens/memoriesWrite';


function MemoriesMain() {
    return (  
        <Stack.Navigator screenOptions={{headerShown: true, headerBackTitleVisible: false, headerBackVisible: false, headerStyle: {backgroundColor: colors.main}, headerTitleAlign: "center", headerTitle: header,}} >
            <Stack.Screen  name="memoriesList" component={MemoriesListScreen}/>
            <Stack.Screen  name="memoriesWrite" component={MemoriesWriteScreen}/>
            <Stack.Screen  name="memoriesDetail" component={MemoriesDetailScreen}/>
        </Stack.Navigator>
    );
}

export default MemoriesMain;