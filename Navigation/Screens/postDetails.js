import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Dimensions, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';

const {width} = Dimensions.get("window");
const height = width*0.6;


export default function PostDetails({route}){
    const images = route.params.images

    return (
        <SafeAreaView style={{flex:1}}>
            <View>
                <ScrollView>
                    <View>
                        <ScrollView horizontal  pagingEnabled showsHorizontalScrollIndicator ={false}>
                        {
                            images.map((image, index)=>(
                                <Image style={{width, height, borderRadius:10}} resizeMode ={'cover'} source={{uri:image}} key ={index}/>
                            ))
                        }
                        </ScrollView>
                    </View>
                    <Text style={{marginTop:10, marginBottom:10, marginLeft:15, fontSize:30, fontWeight:'bold'}}>{route.params.PostTitle}</Text>

                    <Text style={{color: 'lightgray', fontSize:15, fontWeight:'semi-bold', marginLeft:10, marginTop:10}}>Posted By: Sam</Text>
                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}><Image style={{height:35, width:35}} resizeMode={'cover'} source={require('../Screens/Components/Eth.png')}/> {route.params.Price}</Text>
                    </View>

                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Details</Text>
                        <Text style={{marginRight:30, marginLeft:30, color:'lightgray', fontSize:15}}>{route.params.Details}</Text>
                    </View>

                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Description</Text>
                        <Text style={{marginRight:30, marginLeft:30, color:'lightgray', fontSize:15}}>{route.params.Description}</Text>
                    </View>

                    <View style={{flexDirection:'row', justifyContent:'center', width:'100%'}}>
                        <Button title={'Buy Out'} />
                        <Button title={'Place bid'} />
                    </View>
                </ScrollView>
                
            </View>
        </SafeAreaView>
    )
}