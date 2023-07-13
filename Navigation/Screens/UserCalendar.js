import React, {useState} from 'react';
import {View, FlatList, Text, Image} from 'react-native';
import { Calendar } from 'react-native-calendars';

const generateRandomEvents = (numberOfEvents) => {
    const randomEvents = [];

    for (let i = 0; i < numberOfEvents; i++) {
        const event = {
            date: new Date().toISOString().split('T')[0],
            seller:"admin@admin.com",
            buyer:"syakubov101@gmail.com",
            item:"Dimondback Bike",
            time: "9:00 AM"
        };

        randomEvents.push(event);
    }

    return randomEvents;
};

const randomEventsArray = generateRandomEvents(10);

const handleDayPress = (day, setSelectedDate) => {
    setSelectedDate(day.dateString);
};


export default function UserCalendar({route}){
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);

    const filteredEvents = randomEventsArray.filter((event) => {
        return event.date === selectedDate;
    });

    const BuyerOrSellerCard = (item) =>{

        if (item.seller === route.params.currentUsername) {
            return(
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, borderRadius:10}}>
                    <Image
                        source={{ uri: "https://firebasestorage.googleapis.com/v0/b/nyle-bd594.appspot.com/o/ProfilePictures%2Fadmin%40admin.com?alt=media&token=8a725439-c62b-48c5-b585-a9c493a38d44" }}
                        style={{ height: 50, width: 50, borderRadius: 10 }}
                    />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.item}</Text>
                        <Text style={{ fontSize: 14 }}>{item.time}</Text>
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
        <FlatList
            data={filteredEvents}
            renderItem={({ item }) => BuyerOrSellerCard(item)}
            ListHeaderComponent={
            <View>
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
            }
        />
    )
}