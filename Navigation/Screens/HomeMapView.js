import {Alert, Dimensions, Pressable, ScrollView, Text, TextInput, View} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import React from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import {getPosts} from "./GlobalFunctions";
import CustomMapMarker from "./Components/CustomMapMarker";
import MapPostCard from "./Components/MapPostCard";
export default function HomeMapView({navigation, route}){
    const [masterData, setMasterData] = React.useState([]);
    const {width} = Dimensions.get("window");

    React.useEffect(()=>{
        getPosts().then((result) =>{
            setMasterData(result);
        }).catch((error)=>{
            Alert.alert(error)
        })
    }, [])

    return(
        <View style={{ flex: 1 }}>
            <MapView style={{ height: "100%", width: "100%" }}>
                {masterData.map((item, index) => (
                    <View key={index}>
                        <Marker coordinate={item.coordinates}>
                            <CustomMapMarker firstImage={item.pic[0]} />
                        </Marker>

                        <Circle
                            center={item.coordinates}
                            radius={1200}
                            fillColor="rgba(66, 135, 245, 0.2)"
                            strokeColor="rgba(66, 135, 245, 0.7)"
                            strokeWidth={1}
                        />
                    </View>
                ))}
            </MapView>

            <Pressable
                onPress={() => navigation.goBack()}
                style={{
                    position: "absolute",
                    bottom: 30,
                    left: width / 2 - 40,
                    width: 80,
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    zIndex: 1,
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            >
                <View style={{ flexDirection: "row" }}>
                    <Ionicons name="home-outline" size={15} style={{ marginRight: 5 }} />
                    <Text style={{ fontWeight: "bold" }}>Home</Text>
                </View>
            </Pressable>

            <View style={{ position: 'absolute', bottom: 70, width: '100%' }}>
                <ScrollView
                    horizontal
                    style={{ backgroundColor: 'transparent' }}>
                    {
                        masterData.map((item, index) => (
                            <Pressable key={index} onPress={()=>navigation.navigate("post details", {CurrentUserProfilePic:route.params.profilePicture, username:route.params.username, item})}>
                                <View  style={{alignSelf:'center'}}>
                                    <MapPostCard data={item} />
                                </View>
                            </Pressable>

                        ))
                    }
                </ScrollView>
            </View>

        </View>

    )
}