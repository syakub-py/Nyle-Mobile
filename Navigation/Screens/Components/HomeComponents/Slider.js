import {Pressable, ScrollView, Text} from "react-native";
import React from "react";

const handlePress = (index, inputArray,setSelectedIndex, masterData, setFilterData, filter) => {
    setSelectedIndex(index);
    filter(inputArray[index], masterData, setFilterData)
};
export default function Slider({inputArray,masterData,setFilterData, selectedIndex, setSelectedIndex, filter}){
    return(
        <ScrollView horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {{ paddingHorizontal: 15, paddingTop:10, paddingBottom:10}}>
            {
                inputArray.map((item, index) => (
                    <Pressable key = {index}
                               onPress = {()=>handlePress(index, inputArray,setSelectedIndex, masterData, setFilterData, filter)}
                               style = {{backgroundColor: selectedIndex === index ? 'black' : 'whitesmoke', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginRight: 10}}
                    >
                        <Text style = {{color: selectedIndex === index ? '#ffffff' : '#000000', fontSize: 15, fontWeight:'500'}}>
                            {item}
                        </Text>
                    </Pressable>
                ))
            }
        </ScrollView>
    )
}