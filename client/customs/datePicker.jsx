import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontText from './fontText';

function CustomDatePicker({start=true,end=true,startPoint,setStartPoint,endPoint,setEndPoint , textStyle}) {
    const [dateShow1,setDateShow1] = useState(false);
    const [dateShow2,setDateShow2] = useState(false);

    const checkPlatform = Platform.OS === "ios";

    return (
        <View style={styles.datePoinContainer}>
            { (start && !checkPlatform) && 
            <TouchableOpacity onPress={() => setDateShow1(true)} style={styles.register}>
                <FontText style={textStyle ?? styles.text}>{startPoint.getFullYear()}-{`${startPoint.getMonth() + 1}`.padStart(2,"0")}-{`${startPoint.getDate()}`.padStart(2,"0")}</FontText>
            </TouchableOpacity>
            }
            { (end && !checkPlatform) &&
            <>
            <View style={{marginHorizontal : 10}}>
                <FontText>~</FontText>
            </View>
            <TouchableOpacity onPress={() => setDateShow2(true)} style={styles.register}>
                <FontText style={textStyle  ?? styles.text}>{endPoint.getFullYear()}-{endPoint.getMonth() + 1}-{endPoint.getDate()}</FontText>
            </TouchableOpacity>
            </>
            }
        {((dateShow1 || dateShow2) && !checkPlatform )
            &&
               <DateTimePicker locale="ko" testID="dateTimePicker" value={ dateShow1 ? startPoint : endPoint} style={{width: 102}} mode="date" is24Hour={true} onChange={(d)=>{
                   if(d.type === "set"){
                       if(dateShow1){
                           setStartPoint(new Date(d.nativeEvent.timestamp)); 
                       }else{
                           setEndPoint(new Date(d.nativeEvent.timestamp)); 
                       }
                    }
                    setDateShow1(false);
                    setDateShow2(false); 
               }} />
           }
           {checkPlatform ? (end ? 
           <>
               <DateTimePicker locale="ko" testID="dateTimePicker" value={startPoint} style={{width: 102}} mode="date" is24Hour={true} onChange={(d)=>{
                   if(d.type === "set"){
                        setStartPoint(new Date(d.nativeEvent.timestamp)); 
                    }
               }} />
               <FontText>  ~  </FontText>
               <DateTimePicker locale="ko" testID="dateTimePicker" value={endPoint} style={{width: 102}} mode="date" is24Hour={true} onChange={(d)=>{
                   if(d.type === "set"){
                        setEndPoint(new Date(d.nativeEvent.timestamp)); 
                    }
               }} />
               </>
               : 
               <DateTimePicker locale="ko" testID="dateTimePicker" value={startPoint} style={{width: 96}} mode="date" is24Hour={true} onChange={(d)=>{
                   if(d.type === "set"){
                        setStartPoint(new Date(d.nativeEvent.timestamp)); 
                    }
               }} />)
               : <></>

           }
        </View>

    );
}

export default CustomDatePicker;

const styles = StyleSheet.create({
    datePoinContainer:{
        flexDirection : "row",
        alignItems : "center"
    },
    text : {
        fontSize : 12
    }
});