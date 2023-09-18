import {ScrollView, Text, View} from "react-native";
import React from "react";


export default function renderHomesSection(item, realEstateData){
    if (!(item.category === "Homes" && realEstateData.length > 0 && realEstateData)) return <View></View>
    return (
        <View>
            <View style = {{ marginLeft: 25 }}>
                <Text style = {{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>Public Records for {item.title}</Text>
                <Text style = {{ fontSize: 15, color: 'lightgrey', marginTop: 5, marginBottom: 5 }}>Beta only works in New York City</Text>
                <ScrollView>
                    {
                        realEstateData.map((record, index) => (
                            <View key = {index} style = {{ flexDirection: "row", margin: 5 }}>
                                <Text>{record.NAME}</Text>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        </View>
    )
}