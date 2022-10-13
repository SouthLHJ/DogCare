//폰트
import {useFonts} from "expo-font";

import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AppContextProvider } from "./contexts/app-context.js";
import MainScreen from "./screens/main.jsx"





export default function App() {

  //폰트
  const [fontsLoaded] = useFonts({
    'GothicA1-Black': require('./assets/fonts/GothicA1-Black.ttf'),
    'GothicA1-Bold': require('./assets/fonts/GothicA1-Bold.ttf'),
    'GothicA1-ExtraBold': require('./assets/fonts/GothicA1-ExtraBold.ttf'),
    'GothicA1-SemiBold': require('./assets/fonts/GothicA1-SemiBold.ttf'),
    'GothicA1-Light': require('./assets/fonts/GothicA1-Light.ttf'),
    'GothicA1-Medium': require('./assets/fonts/GothicA1-Medium.ttf'),
    'GothicA1-Regular': require('./assets/fonts/GothicA1-Regular.ttf'),
    'GothicA1-Thin': require('./assets/fonts/GothicA1-Thin.ttf'),
    "BlackHanSans-Regular"  : require('./assets/fonts/BlackHanSans-Regular.ttf'),
    "Jua-Regular" :  require('./assets/fonts/Jua-Regular.ttf'),
    "Hyemin-Bold"  : require('./assets/fonts/IM_Hyemin-Bold.ttf'),
    "Hyemin-Regular" :  require('./assets/fonts/IM_Hyemin-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer>
      <AppContextProvider>
          <MainScreen />
      </AppContextProvider>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor :"white"
  },
});
