import { View, Text, StyleSheet, SafeAreaView, TextComponent, } from 'react-native';


export default function YourPostCard({route}){
    return(
        <View style={{flex:1}}>
            <View style={{margin:10, backgroundColor:'white', borderRadius:9, height:65, elevation:1}}>
                <Text style={{fontSize:15, fontWeight:'bold', color:'black', paddingHorizontal:10}}>this is a test</Text>
                <Text style={{fontSize:13, fontWeight:'500', color:'lightgray', paddingHorizontal:10}}>price</Text>
                <Text style={{fontSize:13, fontWeight:'500', color:'lightgray', paddingHorizontal:10}}>Date Posted</Text>
            </View>
        </View>
    );
}