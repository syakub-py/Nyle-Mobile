import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CategoryCard({IconName}) {
    return(
        <View style={{height:75, margin:15, backgroundColor:'white', borderRadius:100, width:75, alignItems:'center', justifyContent:'center', elevation:2}}>
            {/* <Image source={imageUri} style={{flex:1, height:100, width:100, resizeMode:'cover', borderRadius:20}}/> */}
            <Ionicons name={IconName} size={30} />
        </View>
    );
}

