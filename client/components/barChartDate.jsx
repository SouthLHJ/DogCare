import { useContext, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import {BarChart} from 'react-native-chart-kit'
import { ConsumeContext, SearchContext } from '../contexts/consume-context';
import { colors } from '../customs/globalStyle';
import Loading from '../customs/loading';

function ConsumeBarChartDate() {
    const searchContext = useContext(SearchContext);

    const [data, setData] = useState([0,0,0,0,0,0,0]);

    useEffect(()=>{
        const labels = ["용품", "간식", "사료", "위생", "약", "치료비", "기타"];
        // console.log(arr)
        const combinedArr = [0,0,0,0,0,0,0];
        
        const arr = searchContext.search
        arr?.forEach((one)=>{
            const idx = labels.indexOf(one.category);
            if(idx == -1){
                combinedArr[6] += one.ammount/10000
            }else{
                combinedArr[idx] += one.ammount/10000
            }
        })
        // console.log(combinedArr)
        setData(combinedArr);

    },[searchContext.search])

    return (
            <BarChart
                data={{
                    labels: ["용품", "간식", "사료", "위생", "약", "치료비", "기타"],
                    datasets: [{data: data}]
                }}
                width={Dimensions.get('screen').width-20}
                height={200}
                yAxisSuffix="만원"
                chartConfig={{
                    barPercentage : 0.6,
                    backgroundColor: colors.mid,
                    backgroundGradientFrom: colors.mid, // 배경색깔 그라데이션용 (왼쪽)
                    backgroundGradientTo: colors.mid,    // 배경색깔 그라데이션용 (오른쪽)
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // 그래프 내부 색상 투명도
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    propsForVerticalLabels : {},
                }}
                yLabelsOffset={5}
                showValuesOnTopOfBars={true}
                // horizontalLabelRotation={-30}
                verticalLabelRotation={0} // 라벨 글자 기울기 정도
                style={{

                    marginVertical: 8,
                    borderRadius: 10,
                    // marginLeft : -5
                }}
            />

      );
}

export default ConsumeBarChartDate;