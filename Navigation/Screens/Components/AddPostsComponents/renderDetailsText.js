import {View} from "react-native";
import {CustomTextWithInput} from "../CustomText";
import React from "react";


export default function renderDetailsText(category, setDetails){
    if ((category === "Homes" || category === "Auto")) {
        return <View/>
    }
    return (
        <View>
            <CustomTextWithInput
                text="Details"
                onChangeText={(text) => setDetails(text)}
                multiline
                height={200}
            />
        </View>
    )
}
