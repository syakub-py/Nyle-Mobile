import {Alert, FlatList, Image, Pressable, RefreshControl, ScrollView, Text, TextInput, View} from 'react-native';
import React from 'react';

export default function CustomMapMarker({firstImage}) {
    return(
        <View style={{ flexDirection: 'column', alignItems:'center'}}>
            <View
                style={{
                    backgroundColor: 'white',
                    height: 55,
                    width: 55,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 18,
                    marginBottom: -3,
                }}
            >
                <Image
                    source={{ uri: firstImage }}
                    style={{ height: 45, width: 45, borderRadius: 15 }}
                />
            </View>
            <View
                style={{
                    width: 0,
                    height: 0,
                    borderTopWidth: 15,
                    borderLeftWidth: 9,
                    borderRightWidth: 9,
                    borderStyle: 'solid',
                    backgroundColor: 'transparent',
                    borderTopColor: 'white',
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                }}
            />
        </View>
    )
}