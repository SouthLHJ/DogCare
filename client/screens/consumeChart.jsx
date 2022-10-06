import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
/*
    차트
    - 설치 : react-native-chart-kit / react-native-svg@9.13.3 (다운그레이드 필수)
    - 참고 페이지 : https://www.npmjs.com/package/react-native-chart-kit
*/

import { LineChart,BarChart,PieChart } from 'react-native-chart-kit'
import { AppContext } from "../contexts/app-context";
import globalStyles from "../customs/globalStyle";
import Loading from "../customs/loading";


function ConsumeChartScreen() {
    const context  = useContext(AppContext);

    const [data,setData] = useState();
    const [startPoint, setStartPoint] = useState(new Date());
    const [endPoint, setEndPoint] = useState(new Date());

    useEffect(()=>{
        // 소비내역 이번달 꺼 싹 불러오는 api 실행
        
        // 실행해서 나온 값을 저장하게한다.
        setData(
            {
                data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100
                ]
            }
        )
    },[])

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

    if(!data){
        return(
            <Loading/>
        );
    }

    return (
        <View style={globalStyles.container}>
            <ScrollView style={{marginVertical : 30}}>
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
                <Text>바 차트</Text>
                <BarChart
                    data={{
                        labels: ["용품", "간식", "사료", "위생", "약", "치료비"],
                        datasets: [
                        {
                            data: [20, 45, 28, 80, 99, 43]
                        }
                        ]
                    }}
                    width={Dimensions.get("window").width}
                    height={220}
                    yAxisLabel="$"
                    chartConfig={{backgroundColor: "white",
                    backgroundGradientFrom: "#0089FF", // 배경색깔 그라데이션용 (왼쪽)
                    backgroundGradientTo: "#0089FF",    // 배경색깔 그라데이션용 (오른쪽)
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // 그래프 내부 색상 투명도
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 30    
                    },
                    propsForDots: {
                        r: "2",
                        strokeWidth: "3",
                        stroke: "white"
                    }}}
                    verticalLabelRotation={0} // 라벨 글자 기울기 정도
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
            </ScrollView>

        </View>
    );
}

export default ConsumeChartScreen;

const styles = StyleSheet.create({
    chart: {
        flex: 1
    },
    chartConfig: {
        backgroundGradientFrom: '#1E2923',
        backgroundGradientTo: '#08130D',
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`
    }

});