import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { createStaticMapURI } from "../api/place";
import FontText from "../customs/fontText";
import PlaceInfoModal from "./placeInfoModal";
// item.geometry.location.lat/lng
function MyPagePlaceItem({item}) {
    const [mapURI, setMapURI] = useState("");
    const [modal, setModal]  = useState(false);

    useEffect(()=>{
        const resMapUri = createStaticMapURI(item.geometry.location.lat,item.geometry.location.lng);
        setMapURI(resMapUri);
    },[])
    return (  
    <TouchableOpacity onPress={()=>setModal(true)}>
    <View style={styles.itemBox}>
            <View style={{flex :2,justifyContent : "space-between"}}>
                <View >
                    <FontText style={styles.titleText} bold={"semi"}>{item.name}</FontText>
                </View>
                <View>
                    <FontText style={styles.text}>{item?.formatted_address}</FontText>
                </View>
                <View>
                    <FontText style={styles.text}>{item?.formatted_phone_number}</FontText>
                </View>
                <View>
                    <FontText style={styles.text}>{item?.opening_hours?.weekday_text[0] ?? "영업시간 미등록"}</FontText>
                </View>
            </View>
            {/* {modal &&<WalkRegister modal={modal} setModal={setModal} time1={item.time1} time2={item.time2} image={item?.image} memo={item?.memo} edit={true} id={item._id}/> } */}
            <View style={{ flex: 1, alignItems: "flex-end" }}>
                {mapURI ? <Image source={{ uri: mapURI }} style={{ height: "100%", width: 78, borderRadius: 8 }} />
                    : <></>
                }
            </View>
    </View>
        <PlaceInfoModal currentCoords={item.geometry.location} item_id={item?.place_id} visible={modal} onCloseModal={() => {
            setModal(false);
        }} />
    </TouchableOpacity>
    );
}

export default MyPagePlaceItem;
 
const styles = StyleSheet.create({
    titleText :{
    },
    text :{

    },
    itemBox: {
        height : 100,
        width: "98%",
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "#0089FF",
        marginVertical: 8,
        borderRadius: 8,
        padding: 8
    },
    iconBox: {
        flexDirection: "row"
    }
});