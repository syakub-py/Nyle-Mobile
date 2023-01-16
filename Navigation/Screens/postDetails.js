import faker from 'faker';
import { View, Text, SafeAreaView, Image, Dimensions, ScrollView, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-elements';


const {width} = Dimensions.get("window");
const height = width*0.6;


export default function PostDetails({route, navigation}){
    const images = route.params.images
    return (
        <SafeAreaView style={{flex:1}}>
            

            <View>
                <View style={{zIndex:1}}>
                    <Avatar size={55} rounded source={{uri: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`}} containerStyle={{ position: 'absolute', top: 20, right: 10, elevation:2}}/>
                    <View style={{position: 'absolute', top: 30, left: 20, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:70, opacity:0.8, alignItems:'center', justifyContent:'center'}}>
                        <Pressable onPress={()=>navigation.goBack()}>
                            <Ionicons name='arrow-back-outline' size={30}/>
                        </Pressable>
                    </View>
                </View>
                <ScrollView>
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                    {
                        images.map((image, index)=>(
                            <View style={{width, height, borderRadius:10, position: 'relative'}} key={index}>
                                <Image style={{width, height, borderRadius:10}} resizeMode = {'cover'} source={{uri:image}} key ={index}/>
                                
                            </View>
                        ))
                    }
                    </ScrollView>

                    <View style={{flexDirection:"row", justifyContent:'space-between'}}>
                        <Text style={{marginTop:10, marginBottom:10, marginLeft:15, fontSize:30, fontWeight:'bold'}}>{route.params.PostTitle}</Text>
                        <Pressable onPress={()=>navigation.navigate('chat box')}>
                            <View style={{height:60, width:60, borderRadius:100, backgroundColor:'black', elevation:10, margin:10}}>
                                <Ionicons name="chatbox" color={'white'} size={30} style={{margin:15}}/>
                            </View>
                        </Pressable>

                    </View>

                    <Text style={{color:'gray', fontSize:20, marginLeft:10, marginBottom:15}}><Ionicons name='location-outline' size={20} style={{marginRight: 10}}/>{route.params.Location}</Text>

                    <Text style={{color: 'lightgray', fontSize:17, fontWeight:'semi-bold', marginLeft:10, marginTop:10}}>Posted By: {faker.name.findName()}</Text>
                    
                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}><Image style={{height:35, width:35}} resizeMode={'cover'} source={{uri:route.params.Currency}}/> {route.params.Price}</Text>
                    </View>

                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Details</Text>
                        <Text style={{marginRight:30, marginLeft:30, color:'lightgray', fontSize:15}}>{route.params.Details}</Text>
                    </View>

                    <View style={{marginBottom:20}}>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Description</Text>
                        <Text style={{marginRight:30, marginLeft:30, color:'lightgray', fontSize:15}}>{route.params.Description}</Text>
                    </View>
                    
                    <View style={{flexDirection:'row', justifyContent:'center', width:'100%', justifyContent:'space-evenly'}}>
                        <View style={{justifyContent:"center", backgroundColor:"black", borderRadius:200, width:150, height:50, alignItems:'center'}}>
                            <Pressable>
                                <Text style={{color:'white', fontSize:15, fontWeight:"bold"}}>Place Bid</Text>
                            </Pressable>
                        </View>

                        <View style={{justifyContent:"center", backgroundColor:"black", borderRadius:200, width:150, height:50, alignItems:'center', marginBottom:10}}>
                            <Pressable>
                                <Text style={{color:'white', fontSize:15, fontWeight:"bold"}}>Buy out</Text>
                            </Pressable>
                        </View>

                    </View> 
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}