import React, {useState} from 'react';
import {View, FlatList, Text, Image, ScrollView, Dimensions, Pressable} from 'react-native';
import { Calendar } from 'react-native-calendars';
import MapView, {Circle, Marker} from 'react-native-maps';
import CustomMapMarker from "./Components/CustomMapMarker";
import Ionicons from "react-native-vector-icons/Ionicons";

const {width} = Dimensions.get("window");

const handleDayPress = (day, setSelectedDate) => {
    setSelectedDate(day.dateString);
};
export default function TransactionCalendar({route, navigation}){
    const [selectedDate, setSelectedDate] = useState(null);

    return (
            <ScrollView style={{ zIndex: 1 }}>

                <View style={{ zIndex: 2, position: 'absolute', top: 30, left: 17 }}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-outline" size={30} />
                    </Pressable>
                </View>

                <View style={{ marginTop: 80 }}>
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
                        <MapView style={{ height: '100%', width: '100%' }} />
                    </View>
                </View>
            </ScrollView>
    );
}

