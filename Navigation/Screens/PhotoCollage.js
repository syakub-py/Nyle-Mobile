import {Dimensions, Image, Pressable, ScrollView, View, Text, SafeAreaView} from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function PhotoCollage({ route, navigation }){
    const pictures = route.params.pictures;

    return (
        <SafeAreaView>
            <View style={{height:80, backgroundColor:"white"}}>

                <View style={{flexDirection:'row', alignItems:'center', marginTop:30}}>
                    <View style = {{height:50, width:40, alignItems:'center', justifyContent:'center'}}>
                        <Pressable onPress = {() =>navigation.goBack()}>
                            <Ionicons name ='chevron-back-outline' size = {30}/>
                        </Pressable>
                    </View>

                    <Image source={{uri:pictures[0]}} style={{height:40, width:40, marginRight:6, borderRadius:7}}/>

                    <View>
                        <Text style={{fontWeight:'bold', fontSize:15}}>{route.params.title}</Text>
                    </View>

                </View>

            </View>

            <ScrollView contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                    pictures.map((photo, key) => {
                        const height = 300;
                        let width = '100%';

                        if (key % 3 === 1 || key % 3 === 2) {
                            width = '50%';
                        }
                        return (
                            <Pressable
                                key={key}
                                style={{ width, height }}
                                onPress={() => navigation.navigate('Image Viewer', { pictures: pictures, index: key })}
                            >
                                <View style={{ flex: 1, padding: 5}}>
                                    <Image source={{ uri: photo }} style={{flex: 1, width: '100%', height: '100%', borderRadius:10 ,elevation:1}} />
                                </View>
                            </Pressable>
                        );
                    })
                }
            </ScrollView>
        </SafeAreaView>

    );
};