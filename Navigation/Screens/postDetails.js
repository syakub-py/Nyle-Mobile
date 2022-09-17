import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Dimensions, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';


const {width} = Dimensions.get("window");
const height = width*0.6;


export default function PostDetails(){
    const images = [
        'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/1005162/pexels-photo-1005162.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/12513516/pexels-photo-12513516.jpeg?auto=compress&cs=tinysrgb&w=1600',
        'https://images.pexels.com/photos/3752169/pexels-photo-3752169.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ] 

    return (
        <SafeAreaView style={{flex:1}}>
            <View>
                <ScrollView>
                    <Text style={{marginTop:50, marginBottom:10, marginLeft:15, fontSize:30, fontWeight:'bold', alignSelf:'center'}}>2015 lamborghini Hurcan</Text>
                    
                    <View >
                        <ScrollView horizontal  pagingEnabled showsHorizontalScrollIndicator ={false}>
                        {
                            images.map((image, index)=>(
                                <Image style={{width, height, borderRadius:10}} resizeMode ={'cover'} source={{uri:image}} key ={index}/>
                            ))
                        }
                        </ScrollView>
                    </View>
                    <Text style={{color: 'lightgray', fontSize:15, fontWeight:'bold', marginLeft:10, marginTop:10}}>Posted By: Sam</Text>
                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}><Image style={{height:50, width:50}} resizeMode={'stretch'} source={require('../Screens/Components/Eth.png')}/> 135</Text>
                    </View>

                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black', margin:20}}>Details</Text>
                        <Text style={{marginRight:30, marginLeft:30, color:'lightgray', fontSize:15}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
                    </View>

                    <View>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Description</Text>
                        <Text style={{marginRight:30, marginLeft:30, color:'lightgray', fontSize:15}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. lajf;jlfjlafjflajfldsjfdsjfldsjlajfdlkfjdf;iogjflkghgjkhgfdsgfdjgoijflkgjdfosgjjfglkjfdoigjdfgjldsfgj</Text>
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