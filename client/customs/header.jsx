import { View } from "react-native";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import FontText from "./fontText";
import { colors } from "./globalStyle";


const header = () => {
    return (
        <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
            <FontText title={true} bold={true} style={{ fontSize: 24, color: colors.dark, marginHorizontal: 2 }}>
                내새꾸
            </FontText>
            <Ionicons name="md-paw" size={24} color={colors.dark} />
        </View>
    )
};

export default header