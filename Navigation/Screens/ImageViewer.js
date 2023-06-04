import ImageViewer from 'react-native-image-zoom-viewer';
import Ionicons from "react-native-vector-icons/Ionicons";
import {Pressable, View} from "react-native";
import React from "react";


/*
    @route.params = {index: index to start, pictures: array of urls to show}
*/

export default function ViewImages({ route, navigation }) {
    const { pictures, index } = route.params;

    const getImages = (array) => {
        return array.map((image) => ({ url: image }));
    };

    const handlePressClose = () => {
        navigation.goBack();
    };

    return (
        <ImageViewer
            imageUrls={getImages(pictures)}
            enableSwipeDown={true}
            renderHeader={() => (
                <View
                    style={{
                        position: 'absolute',
                        top: 30,
                        left: 15,
                        height: 50,
                        width: 50,
                        elevation: 2,
                        backgroundColor: 'white',
                        borderRadius: 13,
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Pressable onPress={handlePressClose}>
                        <Ionicons name="close-outline" size={30} />
                    </Pressable>
                </View>
            )}
            onSwipeDown={handlePressClose}
            index={index}
            backgroundColor="transparent"
        />
    );
}
