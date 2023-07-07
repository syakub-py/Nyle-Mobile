import { Dimensions, Image, Pressable, ScrollView, View} from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function PhotoCollage({ route, navigation }){
    const pictures = route.params.pictures;

    const getRandomHeight = () => {
        return Math.floor(Math.random() * (300 - 100 + 1)) + 300;
    };

    const screenWidth = Dimensions.get('window').width;

    const columnWidth = screenWidth / 2;

    return (
        <View>
            <View style={{height:100, backgroundColor:"white"}}>
                <View style = {{position: 'absolute', top: 30, height:50, width:50 , alignItems:'center', justifyContent:'center'}}>
                    <Pressable onPress = {() =>navigation.goBack()}>
                        <Ionicons name ='chevron-back-outline' size = {30}/>
                    </Pressable>
                </View>
            </View>
            <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                    pictures.map((photo, key) => {
                        const height = getRandomHeight();
                        const width = columnWidth;

                        return (
                            <Pressable
                                key={key}
                                style={{ width, height }}
                                onPress={() => navigation.navigate('Image Viewer', { pictures: pictures, index: key })}>

                                <View style={{ flex: 1, padding: 5 }}>
                                    <Image source={{ uri: photo }} style={{ flex: 1, width: '100%', height: '100%' }} />
                                </View>

                            </Pressable>
                        );
                    })
                }
            </ScrollView>
        </View>

    );
};