import { useContext, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import {BarChart} from 'react-native-chart-kit'
import { ConsumeContext } from '../contexts/consume-context';
import Loading from '../customs/loading';

function ConsumeBarChart() {
    const consumeContext = useContext(ConsumeContext);

    const [data, setData] = useState([0,0,0,0,0,0,0]);

    useEffect(()=>{
        const labels = ["용품", "간식", "사료", "위생", "약", "치료비", "기타"];
        const arr = consumeContext.data
        // console.log(arr)
        const combinedArr = [0,0,0,0,0,0,0];
        arr?.forEach((one)=>{
            const idx = labels.indexOf(one.category);
            combinedArr[idx] += one.ammount/10000
        })
        // console.log(combinedArr)
        setData(combinedArr);

    },[consumeContext.data])


    return (
            <BarChart
                data={{
                    labels: ["용품", "간식", "사료", "위생", "약", "치료비", "기타"],
                    datasets: [{data: data}]
                }}
                width={Dimensions.get('screen').width}
                height={250}
                yAxisSuffix="만원"
                chartConfig={{
                    barPercentage : 0.8,
                    backgroundColor: "white",
                    backgroundGradientFrom: "#0089FF", // 배경색깔 그라데이션용 (왼쪽)
                    backgroundGradientTo: "#0088FF",    // 배경색깔 그라데이션용 (오른쪽)
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // 그래프 내부 색상 투명도
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    propsForVerticalLabels : {},
                }}
                yLabelsOffset={0}
                // horizontalLabelRotation={-30}
                verticalLabelRotation={0} // 라벨 글자 기울기 정도
                style={{
                    marginVertical: 8,
                    borderRadius: 10,
                    marginLeft : -4
                }}
            />

      );
}

export default ConsumeBarChart;