import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {firestore} from "../Components/Firebase";
import {SwipeListView} from "react-native-swipe-list-view";
import BuyerOrSellerCard, {getRandomLightColor} from "../Components/UserCalendarComponents/BuyerOrSellerCard";
import ApproveDenyButton from "../Components/UserCalendarComponents/ApproveDenyButton";
import BackButton from "../Components/BackButton";

const handleDayPress = (day, setSelectedDate) => {
    setSelectedDate(day.dateString);
};

const getCalendarEvents = async (username) => {
    const MySellerEvents = firestore.collection('CalendarEvents').where("seller", "==", username);
    const MyBuyerEvents = firestore.collection('CalendarEvents').where("buyer", "==", username);

    const [sellerQuerySnapshot, buyerQuerySnapshot] = await Promise.all([MySellerEvents.get(), MyBuyerEvents.get()]);

    const sellerEvents = sellerQuerySnapshot.docs;
    const buyerEvents = buyerQuerySnapshot.docs;

    // Combine the results or perform any desired operations
    const combinedResults = sellerEvents.concat(buyerEvents);
    return combinedResults.map((doc) => ({id: doc.id, ...doc.data()}));
};

const handleApproveDenyPress = async (DocId, status) => {
    return firestore.collection("CalendarEvents").doc(DocId).set({status:status, seen:true}, { merge: true })
        .then(ref => {
            console.log(status)
        })
        .catch(error => {
            console.log('Error adding document: ', error);
        });
}


const handleDelete = async (docId, calendarEvents, setCalendarEvents) =>{
    await firestore
        .collection("CalendarEvents")
        .doc(docId)
        .delete()
        .then(()=>{
            alert("Pickup deleted")
        })
    calendarEvents = calendarEvents.filter((item)=>item.id !== docId)
    setCalendarEvents(calendarEvents)
}

export default function UserCalendar({navigation,route}){
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [calendarEvents, setCalendarEvents] = useState([])
    const username =route.params.currentUsername

    useEffect(async () => {
            try {
                const result = await getCalendarEvents(username);
                setCalendarEvents(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }

    }, []);


    const filteredEvents = calendarEvents.filter((event) => {
        return event.startTime === selectedDate;
    });

    return(
        <SwipeListView
            data={filteredEvents}
            renderItem={({ item }) => (<BuyerOrSellerCard item={item} username={username}/>)}
            contentContainerStyle={{
                flex:1,
                backgroundColor:"white"
            }}
            rightOpenValue = {-120}
            renderHiddenItem = {({item}) => (
                    <View style = {{ position: 'absolute',
                        flexDirection:'row',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: 110,
                        alignItems: 'center'
                    }}>
                        {
                            (item.seller === username)?(
                                <View style={{flexDirection:'row', justifyContent:'center'}}>
                                    <ApproveDenyButton onPress={()=>handleApproveDenyPress(item.id, "approved")} iconName={'checkmark-outline'} color={"green"}/>
                                    <ApproveDenyButton onPress={()=>handleApproveDenyPress(item.id,"denied")} iconName={'close-outline'} color={"red"}/>
                                </View>

                            ):(
                                <ApproveDenyButton onPress={()=>handleDelete(item.id, calendarEvents, setCalendarEvents)} iconName={'trash-outline'} color={"red"}/>
                            )
                        }
                    </View>
                )
            }
            ListHeaderComponent={
            <View>
                <View style={{position: 'absolute', top: 30, left: 17 }}>
                    <BackButton navigation={navigation}/>
                </View>
                <View style={{marginTop:55}}>
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

            </View>
            }
        />
    )
}