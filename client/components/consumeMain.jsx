//상단 탭
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { getDogInfo } from '../api/dog';
import { AppContext } from '../contexts/app-context';
import { ConsumeContextProvider } from '../contexts/consume-context';
import FontText from '../customs/fontText';
import { colors } from '../customs/globalStyle';
const TopTab = createMaterialTopTabNavigator();

import ConsumeChartScreen from '../screens/consumeChart';
import ConsumeListScreen from '../screens/consumeList';
import ConsumeRegisterScreen from '../screens/consumeRegister';
import Header from './header';


function ConsumeMain({ navigation }) {
    const {auth} = useContext(AppContext);
    const [hasDog, setHasDog] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        getDogInfo(auth.token)
            .then((rcv) => {
                if (rcv.result) {
                    // console.log(rcv)
                    setHasDog(rcv.data ? true : false);
                } else {
                    console.log(rcv.msg);
                };
            }).catch((err) => {
                console.log("getDog === ", err.message);
            });
    }, [isFocused])


    if (hasDog) {
        return (
            <ConsumeContextProvider>
                <TopTab.Navigator screenOptions={{
                    tabBarStyle: { display: 'flex', backgroundColor: "white", height: 55, shadowColor: "white", margin: 12, marginBottom: 0, borderTopRightRadius: 12, borderTopLeftRadius: 12, padding: 8 },
                    tabBarActiveTintColor: colors.white,
                    tabBarInactiveTintColor: colors.sub,
                    tabBarLabelStyle: { marginTop: 0, marginLeft: -15 },
                    tabBarIndicatorStyle: { backgroundColor: colors.sub, width: '46%', height: '90%', borderRadius: 20, marginBottom: 2, marginHorizontal: 2 },
                    tabBarIndicatorContainerStyle: { marginTop: 2, borderColor: colors.sub, borderWidth: 1, padding: 0, borderRadius: 20, height: 42, margin: 8, marginTop: 8, marginBottom: 0, width: Dimensions.get('screen').width - 40 },
                    tabBarPressColor: colors.sub,
                    tabBarPressOpacity: 1,
                }}>
                    <TopTab.Screen name="consumeChart" component={ConsumeChartScreen} options={{ title: "목록" }} />
                    <TopTab.Screen name="consumeRegister" component={ConsumeRegisterScreen} options={{ title: "관리" }} />
                </TopTab.Navigator>
            </ConsumeContextProvider>
        );
    } else {
        return (
        <View style={{flex: 1, backgroundColor: "white", margin: 12, borderRadius: 12, justifyContent: "center", alignItems: "center" }}>
                <FontText title={true} bold={true} style={{fontSize: 14}}>해당 기능을 이용하려면 반려견 등록이 필요해요!</FontText>
                <TouchableOpacity style={{borderBottomWidth: 1, borderBottomColor: colors.dark, marginVertical: 6}} onPress={() => {
                    navigation.navigate("mypageMain");
                }}>
                    <FontText title={true}  style={{fontSize: 16}}>반려견 등록하러 가기</FontText>
                </TouchableOpacity>
        </View>
        );
    }

}

export default ConsumeMain