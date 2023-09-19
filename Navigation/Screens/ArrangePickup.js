import React, {useState} from 'react';
import {View, Text, ScrollView, Dimensions, Pressable, TextInput, Modal} from 'react-native';
import { Calendar } from 'react-native-calendars';
import MapView, {Marker} from 'react-native-maps';
import {firestore} from "./Components/Firebase";
import BackButton from "./Components/BackButton";
import CloseButton from "./Components/CloseButton";

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
    const [modalVisible, setModalVisible] = useState(false);
    const { height } = Dimensions.get('window');

    const dropMarker = (event) => {
        const coordinate = event.nativeEvent;
        setCoordinates({latitude: coordinate.coordinate.latitude, longitude: coordinate.coordinate.longitude});
        setModalVisible(true)
    }

    const renderModal = () => {
        if (modalVisible){
            return(
                <View style={{ flex: 1 }}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}>
                        <View style={{ flex: 1, justifyContent: 'flex-end'}}>
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    height: height /1.80,
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    elevation:2,
                                    borderColor:'lightgray',
                                    borderWidth:1
                                }}>
                                <ScrollView style={{ flex: 1}} showsVerticalScrollIndicator={false}>

                                    <View style={{position:'absolute', top:10, left:10,}}>
                                        <CloseButton setModalVisible={setModalVisible}/>
                                    </View>


                                    <View style={{marginTop:30, marginBottom:20}}>
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


                                    <View style={{ width: width - 50, height: 300, alignSelf: 'center', marginBottom: 20, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#ccc', backgroundColor: '#f7f7f7' }}>
                                        <TextInput
                                            multiline
                                            placeholder="Message (optional)"
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
                                </ScrollView>
                            </View>
                        </View>

                    </Modal>
                </View>
            )
        }
    }

    return (
        <View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 1}}>
                <View style={{ position: 'absolute', top: 30, left: 17, alignSelf: 'center' }}>
                    <BackButton navigation={navigation}/>
                </View>

                <Text style={{fontSize: 20, marginTop: 30 }}>{route.params.item.title}</Text>
            </View>
            {renderModal()}
            <MapView style={{ height: '100%', width: '100%' }} initialCamera = {{center: coordinates, pitch: 0,heading:0,zoom: 10, altitude:0}} onLongPress = {dropMarker}>
                <Marker coordinate={coordinates}/>
            </MapView>

        </View>
    );
}

