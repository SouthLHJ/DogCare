import { View } from "react-native";
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import FontText from "./fontText";
import { colors } from "./globalStyle";


const header = () => {
    return (
        <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
            <FontAwesome name="heart" size={18} color={colors.white} />
            <FontText title={true} bold={true} style={{ fontSize: 24, color: colors.white, marginHorizontal: 2 }}>
                내새꾸
            </FontText>
            <FontAwesome name="heart" size={18} color={colors.white} />
        </View>
    )
};

export default header