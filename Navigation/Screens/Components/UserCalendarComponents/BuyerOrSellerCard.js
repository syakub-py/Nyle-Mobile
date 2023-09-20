import {Image, Pressable, Text, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useState} from "react";
import RenderDetailModal from "./renderDetailModal";
import RenderStatus from "./renderStatus";

export function getRandomLightColor() {
    // Generate random values for red, green, and blue components
    const r = Math.floor(Math.random() * 128) + 128; // Range: 128-255
    const g = Math.floor(Math.random() * 128) + 128; // Range: 128-255
    const b = Math.floor(Math.random() * 128) + 128; // Range: 128-255

    // Return the RGB color as a string
    return `rgb(${r}, ${g}, ${b})`;
}
export default function BuyerOrSellerCard (item, username){
    const [modalVisible, setModalVisible] = useState(false);
    if (item.seller === username || item.buyer === username) {
        return (
            <Pressable onPress={() => setModalVisible(true)}>
                {RenderDetailModal(item, modalVisible, setModalVisible)}
                <View style={{
                    flexDirection: 'column',
                    margin: 5,
                    borderRadius: 15,
                    backgroundColor: 'white',
                    padding: 10,
                    justifyContent: 'center',
                    borderWidth:1,
                    borderColor:'lightgrey'
                }}>

                    <View style={{
                        height: 80,
                        position: 'absolute',
                        left: 10,
                        backgroundColor: getRandomLightColor(),
                        width: 3,
                        borderRadius: 3
                    }}/>


                    <View style={{flexDirection: "row", marginLeft: 10, marginRight: 10}}>
                        <View style={{flex: 1}}>
                            <Text style={{fontSize: 20, fontWeight: '500', marginBottom: 5}}>{item.title}</Text>
                        </View>

                        <View style={{position: "absolute", right: 0}}>
                            <Text style={{fontSize: 14}}>{item.startTime}</Text>
                            <Text style={{fontSize: 14}}>{item.endTime}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft: 5}}>
                        <Ionicons name="location" size={15}/>
                        <Text style={{marginLeft: 3}}>79-33 213th street</Text>
                    </View>

                    <View style={{flexDirection: "row", position: "relative", zIndex: 1, height: 30, marginLeft: 10}}>
                        <Image
                            source={{uri: item.buyerProfilePic}}
                            style={{
                                height: 30,
                                width: 30,
                                borderRadius: 20,
                                position: "absolute",
                                top: 0,
                                left: 0,
                            }}
                        />
                        <Image
                            source={{uri: item.sellerProfilePic}}
                            style={{
                                height: 30,
                                width: 30,
                                borderRadius: 20,
                                position: "absolute",
                                top: 0,
                                left: 20,
                            }}
                        />
                    </View>
                    <View style={{flex: 1, position: 'absolute', bottom: 10, right: 10}}>
                        {RenderStatus(item)}
                    </View>
                </View>
            </Pressable>

        )
    }
}

