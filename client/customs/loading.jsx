import { ActivityIndicator, View } from "react-native";

function Loading({opacity}) {
    return (
        <View style={{justifyContent: "center", alignSelf: "center", position:'absolute', width:'100%', height: '100%', zIndex: 10000, top: 12}}>
            <View style={{alignSelf: "center", justifyContent: "center", width: 90, height: 90, backgroundColor: `rgba(100,100,100, ${opacity ? opacity : 0.5})`,  borderRadius: 24, elevation: 4}}>
                <ActivityIndicator size="large" color="#F1C65E" />
            </View>
        </View>
    );
}

export default Loading;