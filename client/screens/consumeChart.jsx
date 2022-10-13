// 체크 박스  설치 : npx expo install expo-checkbox

/*
    차트
    - 설치 : react-native-chart-kit / react-native-svg@9.13.3 (다운그레이드 필수)
    - 참고 페이지 : https://www.npmjs.com/package/react-native-chart-kit
*/
import { LineChart,BarChart,PieChart, ProgressChart } from 'react-native-chart-kit'

import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from "react-native";

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { readConsumeAll } from "../api/consume";
import { AppContext } from '../contexts/app-context';
import { ConsumeContext, SearchContext } from '../contexts/consume-context';
import CustomDatePicker from "../customs/datePicker";
import globalStyles, { colors } from "../customs/globalStyle";
import Loading from "../customs/loading";
import FontText from '../customs/fontText';
import ConsumeBarChart from '../components/barChart';
import ConsumeListScreen from './consumeList';
import ConsumeBarChartDate from '../components/barChartDate';


function ConsumeChartScreen() {
    const context  = useContext(AppContext);
    const consumeContext = useContext(ConsumeContext);
    const searchContext = useContext(SearchContext);

    const [chartAll, setChartAll] = useState(true);
    const [startPoint, setStartPoint] = useState(new Date());
    const [endPoint, setEndPoint] = useState(new Date());

    useEffect(()=>{
        // 소비내역 이번달 꺼 싹 불러오는 api 실행
        const token  = context.auth.token
        // console.log(consumeContext.data)
        readConsumeAll(token)
         .then((rcv)=>{
            // console.log("chart",rcv)
            if(rcv.result){
                consumeContext.dispatch({type: "update", payload : rcv.list})
                searchContext.searchdispatch({type: "search", payload : rcv.list})
            }
         })
         .catch(err=>console.log("readCounsumeAll => ",err))
 
    },[])

    //func
    const onSwitch = ()=>{
        setChartAll(current=>!current)
    }

    if(!consumeContext.data){
        return(
            <Loading/>
        );
    }

    return (
        <View style={globalStyles.container}>
            <TouchableOpacity onPress={()=>onSwitch()} style={styles.swithContainer}>
                <FontText style={[globalStyles.textNomal,{marginHorizontal: 4 ,color : colors.black}]}>{chartAll ? "누적 소비 차트" : "기간 소비 차트"}</FontText>
                <FontAwesome5 name="exchange-alt" size={18} color={colors.black} />
            </TouchableOpacity>

            <View style={{alignItems : "center"}}>
                {chartAll ?
                <ConsumeBarChart/>
                :
                <ConsumeBarChartDate/>
                }
            </View>
            {/* <Text>2. 기간 조회 리스트</Text> */}
            <ConsumeListScreen />
            {/* <Text>3. 카테고리 별 조회 가능 차트</Text> */}
        </View>
    );
}

export default ConsumeChartScreen;

const styles = StyleSheet.create({
    
    swithContainer : {
        flexDirection : "row",
        alignItems : "center"
    }


});

/* 차트 참고용~~
    chart: {
        flex: 1
    },
    chartConfig: {
        backgroundGradientFrom: '#1E2923',
        backgroundGradientTo: '#08130D',
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        margin: 8,
    },


    
    const PieData =  [
        {
          name: "용품",
          population: 21500000,
          color: "rgba(131, 167, 234, 1)",
          legendFontColor: "white",
          legendFontSize: 15
        },
        {
          name: "간식",
          population: 2800000,
          color: "#F00",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "사료",
          population: 527612,
          color: "red",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "위생",
          population: 8538000,
          color: "#ffffff",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "약",
          population: 11920000,
          color: "rgb(0, 0, 255)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        }
      ]

    const ProgressData = {
        labels: ["Swim", "Bike", "Run"], // optional
        data: [0.4, 0.6, 0.8]
    };

<ScrollView >
                <Text>라인 차트</Text>
                <LineChart
                    data={{
                        labels: ["용품", "간식", "사료", "위생", "약", "치료비"],
                        datasets: [data]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel="" // 데이터셋 왼쪽에 적히는 글자
                    yAxisSuffix="원" // 데이터 셋 오른쪽에 적히는 글자
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "white",
                        backgroundGradientFrom: "#0089FF", // 배경색깔 그라데이션용 (왼쪽)
                        backgroundGradientTo: "#0089FF",    // 배경색깔 그라데이션용 (오른쪽)
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // 그래프 내부 색상 투명도
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    bezier // 선이 곡선을 이루게 만듬
                    style={{
                        marginVertical: 8,
                        borderRadius: 2
                    }}
                />
                <Text>파이 차트</Text>
                <PieChart
                    data={PieData}
                    width={Dimensions.get("window").width}
                    height={220}
                    chartConfig={{
                        backgroundColor: "white",
                        backgroundGradientFrom: "#0089FF", // 배경색깔 그라데이션용 (왼쪽)
                        backgroundGradientTo: "#0089FF",    // 배경색깔 그라데이션용 (오른쪽)
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // 그래프 내부 색상 투명도
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    accessor={"population"}
                    backgroundColor={"#0089FF"} //배경색깔"transparent"
                    paddingLeft={"15"}
                    center={[10, 10]} // 파이 표 중심점 위치 조정
                    // absolute (퍼센트로 보여줄 것인지 데이터값 고대로 보여줄것인지 결정)
                />

                <Text>프로그래스 차트</Text>
                <ProgressChart
                data={ProgressData}
                width={Dimensions.get("window").width}
                height={220}
                strokeWidth={16}
                radius={32}
                chartConfig={{
                    backgroundColor: "white",
                    backgroundGradientFrom: "#0089FF", // 배경색깔 그라데이션용 (왼쪽)
                    backgroundGradientTo: "#0089FF",    // 배경색깔 그라데이션용 (오른쪽)
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // 그래프 내부 색상 투명도
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                hideLegend={false}
                />
            </ScrollView>
*/