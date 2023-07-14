import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, Image, Alert, SwipeableListView} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {firestore} from "./Components/Firebase";
import {SwipeListView} from "react-native-swipe-list-view";
import Ionicons from "react-native-vector-icons/Ionicons";


const generateRandomEvents = (numberOfEvents) => {
    const randomEvents = [];

    for (let i = 0; i < numberOfEvents; i++) {
        const event = {
            date: new Date().toISOString().split('T')[0],
            seller:"admin@admin.com",
            buyer:"syakubov101@gmail.com",
            item:"Dimondback Bike",
            time: new Date().toISOString().split('T')[1]
        };

        randomEvents.push(event);
    }

    return randomEvents;
};

const randomEventsArray = generateRandomEvents(10);

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
                results.push(doc.data())
            });
            setCalendarEvents(results)
        })
        .catch((error) => {
            // Handle any errors
            console.error("Error getting events:", error);
        });
}

const handleApprove = async (DocId, approved) => {
    return firestore.collection("CalendarEvents").doc(DocId).set({approved:approved})
        .then(ref => {
            console.log("approved")
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


export default function UserCalendar({route}){
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [calendarEvents, setCalendarEvents] = useState([])

    useEffect(()=>{
        getCalendarEvents(route.params.currentUsername, setCalendarEvents)
    },[])

    const filteredEvents = calendarEvents.filter((event) => {

        const timestampMilliseconds = event.startTime.seconds * 1000;

        const dateObject = new Date(timestampMilliseconds);
        const dateString = dateObject.toISOString().split('T')[0];

        return dateString === selectedDate;
    });

    const BuyerOrSellerCard = (item) =>{
        if (item.seller === route.params.currentUsername) {

            const startTime = item.startTime.seconds * 1000;

            const startTimeDateObject = new Date(startTime).toISOString().split('T')[1];

            const endTime = item.endTime.seconds * 1000;

            const endTimeDateObject = new Date(endTime).toISOString().split('T')[1];

            return(
                <View style={{ flexDirection: 'column', margin: 5, borderRadius: 15, backgroundColor: 'white', padding: 10, justifyContent: 'center' }}>

                    <View style={{ height: 80, position: 'absolute', left: 10, backgroundColor: getRandomLightColor(), width: 3, borderRadius: 3 }} />

                    <View style={{ flexDirection: "row", marginLeft: 10, marginRight: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 20, fontWeight: '500', marginBottom: 5 }}>{item.item}</Text>
                        </View>

                        <View style={{ position:"absolute", right:0}}>
                            <Text style={{ fontSize: 14 }}>{startTimeDateObject}</Text>
                            <Text style={{ fontSize: 14 }}>{endTimeDateObject}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom:10, marginLeft:5}}>
                        <Ionicons name="location" size={15} />
                        <Text style={{ marginLeft: 3 }}>79-33 213th street</Text>
                    </View>

                    <View style={{ flexDirection: "row", position: "relative", zIndex: 1, height: 30, marginLeft: 10 }}>
                        <Image
                            source={{ uri: item.buyerProfilePic }}
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
                            source={{ uri: item.sellerProfilePic }}
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

                </View>
            )
        }else{
            return(
                <View>
                    <Text>{item.item}</Text>
                </View>
            )
        }
    }

    return(
        <SwipeListView
            data={filteredEvents}
            renderItem={({ item }) => BuyerOrSellerCard(item)}
            ListHeaderComponent={
            <View>
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