import * as React from 'react';
import {
    Dimensions,
    Image,
    Text,
    View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function MapPostCard({data}) {
    return(
        <View style={{ height: 150, backgroundColor: 'white', borderRadius: 20, margin: 10, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                <Image source={{ uri: data.pic[0] }} style={{ height: 100, width: 100, borderRadius: 20 }} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'center' }}>{data.title}</Text>
            </View>
        </View>
    )
}