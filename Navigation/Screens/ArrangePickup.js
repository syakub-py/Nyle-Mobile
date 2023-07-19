import React, {useState} from 'react';
import {View, FlatList, Text, Image, ScrollView, Dimensions, Pressable, Alert, TextInput} from 'react-native';
import { Calendar } from 'react-native-calendars';
import MapView, {Marker} from 'react-native-maps';
import CustomMapMarker from "./Components/CustomMapMarker";
import Ionicons from "react-native-vector-icons/Ionicons";
import {firestore} from "./Components/Firebase";

const {width} = Dimensions.get("window");

const handleDayPress = (day, setSelectedDate) => {
    setSelectedDate(day.dateString);
};

const handleAddPickup = (route, coordinates, selectedDate, message, navigation) => {
    return firestore.collection("CalendarEvents").doc(route.params.item.title).set({
        title: route.params.item.title,
        seller: route.params.item.PostedBy,
        sellerProfilePic: route.params.item.profilePic,
        buyer:route.params.currentUsername,
        buyerProfilePic: route.params.currentProfilePic,
        coordinates: coordinates,
        startTime: selectedDate,
        endTime: selectedDate,
        status:"pending",
        seen:false,
        message:message
    }).then(() => {
        console.log("added")
        navigation.goBack()
    }).catch(error => {
            console.log('Error adding document: ', error);
        });
}


export default function TransactionCalendar({route, navigation}){
    const [selectedDate, setSelectedDate] = useState(null);
    const [coordinates, setCoordinates] = useState({latitude: 0, longitude: 0});
    const [message, setMessage] = useState("")
    const dropMarker = (event) => {
        const coordinate = event.nativeEvent;
        setCoordinates({latitude: coordinate.coordinate.latitude, longitude: coordinate.coordinate.longitude});
    }

    return (
            <ScrollView style={{ zIndex: 1 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ position: 'absolute', top: 30, left: 17, alignSelf: 'center' }}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back-outline" size={30} />
                        </Pressable>
                    </View>

                    <Text style={{ fontSize: 20, marginTop: 30 }}>{route.params.item.title}</Text>
                </View>

                <View style={{ marginTop: 30 }}>
                    <Text style={{fontSize:17, marginLeft:20, marginBottom:7}}>When?</Text>
                    <View style={{ borderRadius: 10, overflow: 'hidden', margin: 10, width: width - 50, height: 300, alignSelf: 'center' }}>
                        <Calendar
                            markedDates={{ [selectedDate]: { selected: true, marked: true } }}
                            theme={{
                                selectedDayBackgroundColor: 'blue',
                                todayTextColor: 'blue',
                                arrowColor: 'blue',
                            }}
                            onDayPress={(day) => handleDayPress(day, setSelectedDate)}
                        />
                    </View>
                    <Text style={{fontSize:17, marginLeft:20, marginBottom:7}}>Where?</Text>
                    <View style={{ width: width - 50, height: 300, alignSelf: 'center', marginBottom: 20, borderRadius: 20, overflow: 'hidden', elevation: 3 }}>
                        <MapView style={{ height: '100%', width: '100%' }} initialCamera = {{center: coordinates, pitch: 0,heading:0,zoom: 10, altitude:0}} onLongPress = {dropMarker}>
                            <Marker coordinate={coordinates}/>
                        </MapView>
                    </View>

                    <Text style={{fontSize:17, marginLeft:20, marginBottom:7}}>Message</Text>
                    <View style={{ width: width - 50, height: 300, alignSelf: 'center', marginBottom: 20, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#ccc', backgroundColor: '#f7f7f7' }}>
                        <TextInput
                            multiline
                            placeholder="(optional)"
                            style={{ flex: 1, padding: 10 }}
                            onChangeText={(text)=>{
                                setMessage(text)
                            }}
                        />
                    </View>

                    <Pressable onPress={()=>handleAddPickup(route, coordinates, selectedDate, message, navigation)}>
                        <View style={{backgroundColor:'black', justifyContent:'center', width:300, height:50, alignSelf:'center', borderRadius:10}}>
                            <Text style={{color:'white', alignSelf:'center', fontWeight:'bold'}}>Finalize Pickup</Text>
                        </View>
                    </Pressable>
                </View>
            </ScrollView>
    );
}

