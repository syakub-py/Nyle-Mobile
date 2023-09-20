import {Text, View} from "react-native";
import React from "react";

export default function RenderStatus (item){
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
    } else if (item.status === "denied"){
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