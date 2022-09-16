import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';


class CategoryCard extends React.Component{
    render(){
        return(
            <View style={{height:100, width:100, marginLeft:20}}>
                <View style={{flex:2}}>
                    <Image source={this.props.imageUri} style={{flex:1, height:100, width:100, resizeMode:'cover', borderRadius:100}}/>
                </View>
          </View>
        );
    }
}

export default CategoryCard;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "white",
        paddingHorizontal: 20
    },
});
