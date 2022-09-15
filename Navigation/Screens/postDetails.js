import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';

export default function PostDetails({navigation}){
    return (
        <SafeAreaView style = {{flex:1}}>
            <View style ={{width:'100%', position:'absolute', bottom:0, alignItems:"center", justifyContent:"center",  zIndex:1}}>
                <Button title = "Buy Now"/>
            </View>
        </SafeAreaView>
    )
}