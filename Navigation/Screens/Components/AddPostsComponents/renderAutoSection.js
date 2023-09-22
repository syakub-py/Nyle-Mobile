import {View} from "react-native";
import {CustomTextWithInput} from "../CustomText";
import React from "react";


export default function RenderAutoSection({category, setMake, setModel, setMileage, setVIN}) {
    if (category !== "Auto") {
        return <View/>
    }

    return (
        <View>
            <CustomTextWithInput text="Make" onChangeText={(text) => setMake(text)} />
            <CustomTextWithInput text="Model" onChangeText={(text) => setModel(text)} />
            <CustomTextWithInput text="Mileage" onChangeText={(text) => setMileage(text)} />
            <CustomTextWithInput text="VIN" onChangeText={(text) => setVIN(text)} />
        </View>
    )
}
