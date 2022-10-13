import { FontAwesome } from '@expo/vector-icons';

import { Image, StyleSheet, View } from "react-native";
import FontText from "../customs/fontText";
import globalStyles from "../customs/globalStyle";



function PlaceReviewItem({ item }) {
    return (
        <View style={styles.container}>
            <View style={{flexDirection: "row"}}>
            <View style={styles.authContainer}>
                <Image style={styles.authProfile} resizeMode='contain' source={{ uri: item?.profile_photo_url }} />
                <FontText style={[globalStyles.textNomal]}> {item?.author_name}</FontText>
            </View>

            <View style={styles.commentContainer}>
                <FontAwesome name={1 <= item?.rating ? "star" : "star-o"} size={10} color="#F7C447" />
                <FontAwesome name={2 <= item?.rating ? "star" : "star-o"} size={10} color="#F7C447" />
                <FontAwesome name={3 <= item?.rating ? "star" : "star-o"} size={10} color="#F7C447" />
                <FontAwesome name={4 <= item?.rating ? "star" : "star-o"} size={10} color="#F7C447" />
                <FontAwesome name={5 <= item?.rating ? "star" : "star-o"} size={10} color="#F7C447" />
                <FontText> {item?.relative_time_description}</FontText>
            </View>
            </View>

            {item?.text ?
                <FontText style={{ margin: 4 }}>{item?.text}</FontText>
                : <></>
            }
        </View>
    );
}

export default PlaceReviewItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        width: "100%",
        margin: 4,
        marginVertical: 8
    },
    authProfile: {
        height: 20,
        width: 20,
        marginRight: 4
    },
    authContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    commentContainer: {
        flexDirection: "row",
        alignItems: "center",
        margin: 4,
        marginLeft: 12,

    }
});