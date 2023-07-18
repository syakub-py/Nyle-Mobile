import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Pressable, Dimensions, Modal, ScrollView} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {firestore} from "./Components/Firebase";
import {SwipeListView} from "react-native-swipe-list-view";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView, {Circle, Marker} from 'react-native-maps';
import CustomMapMarker from "./Components/CustomMapMarker";


const handleDayPress = (day, setSelectedDate) => {
    setSelectedDate(day.dateString);
};

const getCalendarEvents = async (username, setCalendarEvents) => {
    let results = []
    const MySellerEvents =  firestore.collection('CalendarEvents').where("seller", "==", username)
    const MyBuyerEvents = firestore.collection('CalendarEvents').where("buyer", "==", username);
    Promise.all([MySellerEvents.get(), MyBuyerEvents.get()])
        .then((querySnapshots) => {
            const sellerEvents = querySnapshots[0].docs;
            const buyerEvents = querySnapshots[1].docs;

            // Combine the results or perform any desired operations
            const combinedResults = sellerEvents.concat(buyerEvents);
            combinedResults.forEach((doc) => {
                const resultWithId = { id: doc.id, ...doc.data() };
                results.push(resultWithId);
            });
            setCalendarEvents(results)
        })
        .catch((error) => {
            // Handle any errors
            console.error("Error getting events:", error);
        });
}

const handleApproveDenyPress = async (DocId, status) => {
    return firestore.collection("CalendarEvents").doc(DocId).set({status:status, seen:true}, { merge: true })
        .then(ref => {
            console.log(status)
        })
        .catch(error => {
            console.log('Error adding document: ', error);
        });
}


function getRandomLightColor() {
    // Generate random values for red, green, and blue components
    const r = Math.floor(Math.random() * 128) + 128; // Range: 128-255
    const g = Math.floor(Math.random() * 128) + 128; // Range: 128-255
    const b = Math.floor(Math.random() * 128) + 128; // Range: 128-255

    // Return the RGB color as a string
    return `rgb(${r}, ${g}, ${b})`;
}

export default function UserCalendar({navigation,route}){
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [calendarEvents, setCalendarEvents] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const { height } = Dimensions.get('window');
    const {width} = Dimensions.get("window");


    useEffect(()=>{
        getCalendarEvents(route.params.currentUsername, setCalendarEvents)

    },[])
    const renderStatus = (item) =>{
        if (item.status === "approved"){
            return(
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{
                        backgroundColor: 'lightgreen',
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        marginRight: 5
                    }}/>
                    <Text>Approved</Text>
                </View>
            )
        }

        else if (item.status === "denied"){
            return(
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{
                        backgroundColor: 'red',
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        marginRight: 5
                    }}/>
                    <Text>Denied</Text>
                </View>
            )
        }

        else if (item.status === "pending"){
            return(
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{
                        backgroundColor: 'yellow',
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        marginRight: 5
                    }}/>
                    <Text>Pending</Text>
                </View>
            )
        }
    }


    const filteredEvents = calendarEvents.filter((event) => {
        return event.startTime === selectedDate;
    });

    const BuyerOrSellerCard = (item) => {
        if (item.seller === route.params.currentUsername || item.buyer === route.params.currentUsername) {
            return (
                <Pressable onPress={() => setModalVisible(true)}>
                    {renderDetailModal(item)}
                    <View style={{
                        flexDirection: 'column',
                        margin: 5,
                        borderRadius: 15,
                        backgroundColor: 'white',
                        padding: 10,
                        justifyContent: 'center'
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
                            {renderStatus(item)}
                        </View>
                    </View>
                </Pressable>

            )
        }
    }

    const renderDetailModal = (item) =>{
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
                                    backgroundColor: 'whitesmoke',
                                    height: height / 2,
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    elevation:2
                                }}>

                                <ScrollView style={{ flex: 1}}>
                                    <Pressable onPress={()=>setModalVisible(false)} style={{zIndex:1,backgroundColor:'lightgray', height:30, width:30, borderRadius:20, position:'absolute', top:10, left:10, alignItems:'center', justifyContent:'center'}}>
                                        <Ionicons name={'close-outline'} size={20}/>
                                    </Pressable>

                                    <View style={{padding: 20}}>

                                        <Text style={{fontWeight:'bold', fontSize:20, marginTop:25}}>{item.title}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                            <Image
                                                source={{ uri: item.buyerProfilePic }}
                                                style={{
                                                    height: 40,
                                                    width: 40,
                                                    borderRadius: 20,
                                                }}
                                            />
                                            <View style={{ flexDirection: 'column', marginLeft: 7 }}>
                                                <Text style={{ fontWeight: 'bold' }}>{item.buyer}</Text>
                                                <Text style={{ color: 'lightgray' }}>Buyer</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom:10}}>
                                            <Image
                                                source={{ uri: item.sellerProfilePic }}
                                                style={{
                                                    height: 40,
                                                    width: 40,
                                                    borderRadius: 20,
                                                }}
                                            />
                                            <View style={{ flexDirection: 'column', marginLeft: 7 }}>
                                                <Text style={{ fontWeight: 'bold' }}>{item.seller}</Text>
                                                <Text style={{ color: 'lightgray' }}>Seller</Text>
                                            </View>
                                        </View>
                                        <Text>{item.message}</Text>

                                        <View style={{ flexDirection: 'row', marginTop: 10,marginBottom: 10,}}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Ionicons name={"calendar-outline"} size={15} />
                                                <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                                    <Text style={{ color: 'lightgray', fontSize: 14 }}>Date</Text>
                                                    <Text>{item.startTime}</Text>
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                                                <Ionicons name={"time-outline"} size={15} />
                                                <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                                    <Text style={{ color: 'lightgray', fontSize: 14 }}>Time</Text>
                                                    <Text>{item.startTime}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                                                <Ionicons name={"checkmark-outline"} size={15} />
                                                <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                                    <Text style={{ color: 'lightgray', fontSize: 14 }}>Status</Text>
                                                    <Text>{item.status}</Text>
                                                </View>
                                            </View>
                                        </View>




                                        <View style={{ width: width - 50, height: 300, alignSelf: 'center', marginBottom: 20, borderRadius: 20, overflow: 'hidden', elevation: 3 }}>
                                            <MapView style={{ height: '100%', width: '100%' }} initialCamera={{ center: item.coordinates, pitch: 0, heading: 0, zoom: 15, altitude: 0 }} scrollEnabled={false}>
                                                <Marker coordinate={item.coordinates} />
                                                <Circle
                                                    center={item.coordinates}
                                                    radius={120}
                                                    fillColor="rgba(66, 135, 245, 0.2)"
                                                    strokeColor="rgba(66, 135, 245, 0.7)"
                                                    strokeWidth={1}
                                                />
                                            </MapView>
                                        </View>

                                    </View>
                                </ScrollView>
                            </View>

                        </View>
                    </Modal>
                </View>
            )
        }else{
            return null
        }
    }
    return(
        <SwipeListView
            data={filteredEvents}
            renderItem={({ item }) => BuyerOrSellerCard(item)}
            rightOpenValue = {-120}
            renderHiddenItem = {({item}) => (
                <Pressable onPress={() => setModalVisible(true)}>
                    <View style = {{ position: 'absolute',
                        flexDirection:'row',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: 120,
                        alignItems: 'center'
                    }}>

                        {
                            (item.seller === route.params.currentUsername)?(
                                <View style={{flexDirection:'row'}}>
                                    <TouchableOpacity onPress = {() =>{handleApproveDenyPress(item.id, "approved")}} style={{alignItems:'center', marginRight:15}}>
                                        <Ionicons name = {'checkmark-outline'} color = {"green"} size = {30} />
                                        <Text style={{color:"green"}}>Approve</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress = {() =>{handleApproveDenyPress(item.id,"denied")}} style={{alignItems:'center'}}>
                                        <Ionicons name = {'close-circle-outline'} color = {"red"} size = {30} />
                                        <Text style={{color:"red"}}>Deny</Text>
                                    </TouchableOpacity>
                                </View>

                            ):(
                                <TouchableOpacity onPress = {() =>{}} style={{alignItems:'center'}}>
                                    <Ionicons name = {'close-outline'} color = {"red"} size = {30} />
                                    <Text style={{color:"red"}}>Cancel</Text>
                                </TouchableOpacity>
                            )
                        }


                    </View>
                </Pressable>
                )
            }
            ListHeaderComponent={
            <View>

                <View style={{ zIndex: 2, position: 'absolute', top: 30, left: 17 }}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-outline" size={30} />
                    </Pressable>
                </View>

                <Calendar
                    markedDates={{ [selectedDate]: { selected: true, marked: true } }}
                    theme={{
                        selectedDayBackgroundColor: getRandomLightColor(),
                        todayTextColor: getRandomLightColor(),
                        arrowColor: getRandomLightColor(),
                    }}
                    onDayPress={(day) => handleDayPress(day, setSelectedDate)}
                />
            </View>
            }
        />
    )
}