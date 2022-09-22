import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Dimensions, ScrollView, Pressable } from 'react-native';
import { Button } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';


const {width} = Dimensions.get("window");
const height = width*0.6;


export default function PostDetails({route, navigation}){
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
                    
                    <View style={{flexDirection:"row", justifyContent:'space-between'}}>
                        <Text style={{marginTop:10, marginBottom:10, marginLeft:15, fontSize:30, fontWeight:'bold'}}>{route.params.PostTitle}</Text>
                        <Pressable onPress={()=>navigation.navigate('chat box')}>
                            <View style={{height:60, width:60, borderRadius:100, backgroundColor:'black', elevation:10, margin:10}}>
                                    <Ionicons name="chatbox" color={'white'} size={30} style={{margin:15}}/>
                            </View>
                        </Pressable>
                    </View>
                    <Text style={{color:'gray', fontSize:17, marginLeft:10}}><Ionicons name='location-outline' size={20} style={{marginRight: 10}}/>{route.params.Location}</Text>

                    <Text style={{color: 'lightgray', fontSize:15, fontWeight:'semi-bold', marginLeft:10, marginTop:10}}>Posted By: Sam</Text>
                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}><Image style={{height:35, width:35}} resizeMode={'cover'} source={{uri:route.params.Currency}}/> {route.params.Price}</Text>
                    </View>

                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Details</Text>
                        <Text style={{marginRight:30, marginLeft:30, color:'lightgray', fontSize:15}}>{route.params.Details}</Text>
                    </View>

                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Description</Text>
                        <Text style={{marginRight:30, marginLeft:30, color:'lightgray', fontSize:15}}>{route.params.Description}</Text>
                    </View>
                    
                    <View style={{flexDirection:'row', justifyContent:'center', width:'100%', justifyContent:'space-evenly'}}>
                        <Button title={'Buy Out'} containerStyle={{borderRadius:20, width:150}}/>
                        <Button title={'Place bid'} containerStyle={{borderRadius:20, width:150}}/>
                    </View>

                </ScrollView>
 

            </View>
        </SafeAreaView>
    )
}