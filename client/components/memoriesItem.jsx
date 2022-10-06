import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import FontText from "../customs/fontText";

function MemoriesItem({item}) {
    return (
            <View style={styles.itemBox}>
                <View>
                <FontText>{item.title}</FontText>
                <FontText>{item.date.split("T")[0]}</FontText>
                </View>
                <View style={{flex: 1}}>
                {item.image ? <Image source={{uri: item.image}} />
                : <></>
                }
                </View>
            </View>
    );
};

const styles = StyleSheet.create({
    itemBox: {
        height: 86,
        width: 328,
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "#0089FF",
        marginVertical: 8,
        borderRadius: 8,
        padding: 8
    },
})

export default MemoriesItem;