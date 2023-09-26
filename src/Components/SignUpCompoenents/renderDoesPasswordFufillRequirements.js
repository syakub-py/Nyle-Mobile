import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function RenderDoesPasswordFulfillRequirements({requirements}) {
    return (
        <View>
            <Text style={{marginLeft:20, fontWeight:"bold", fontSize:18}}>Password Requirements:</Text>
            {
                requirements.map((requirement, index) => (
                    <Requirement key={index} requirement={requirement} />
                ))
            }
        </View>
    );
}

function Requirement({ requirement }) {
    const [iconName, setIconName] = useState('checkmark-circle-outline');
    const [color, setColor] = useState('black');

    useEffect(() => {
        // Update the icon and color based on the requirement's fulfillment
        const newIconName = requirement.fulfilled ? 'checkmark-circle' : 'checkmark-circle-outline';
        const newColor = requirement.fulfilled ? 'green' : 'black';

        // Set the state with the updated values for this requirement
        setIconName(newIconName);
        setColor(newColor);
    }, [requirement.fulfilled]);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft:40, marginBottom:4}}>
            <Ionicons name={iconName} size={20} color={color} />
            <Text style={{ marginLeft: 8 }}>{requirement.label}</Text>
        </View>
    );
}