import {Image, ImageBackground, Pressable, ScrollView, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {firestore} from "./Firebase";
import axios from "axios";
import {handleLike} from "../GlobalFunctions";

export default function PostCard({data, username}) {
    const navigation = useNavigation();
    const [price, setPrice] = useState(0)
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const updateCurrencyPrice = async () => {
            try {
                const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page =20&page =1&sparkline =true&price_change_percentage =7d");
                const filteredData = response.data.filter((item) => item.image === data.currency)
                if (filteredData.length > 0) setPrice(filteredData[0].current_price)
            } catch (error) {
                console.log(error.message);
            }

            const postRef = firestore.collection('AllPosts').doc(data.title);
            postRef.get().then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    if (data.hasOwnProperty('USD') && price !== 0) postRef.update({ USD:(price*data.price).toFixed(2).toString()});
                    else {
                        if (price !== 0) {
                            postRef.set({ USD:(price*data.price).toFixed(2).toString() }, { merge: true });
                        }
                    }
                }
            });
        }

        updateCurrencyPrice().then(() => {})

    }, [data.currency])


    return (
        <View style = {{ backgroundColor: 'white', marginBottom: 10, margin: 10, borderRadius:10, elevation:3}}>
            <View style = {{width:"100%", height:300}}>
                <ImageBackground source = {{uri: data.pic[index]}} imageStyle = {{width:"100%", height:300, borderRadius:10, resizeMode:'cover'}}>
                     <View style = {{position:'absolute', right:10,top:10, backgroundColor:'white', height:40, width:40, borderRadius:12, justifyContent:'center', alignItems:'center', opacity:0.7}}>
                            <Pressable onPress= {() =>handleLike(data.title, username)}>
                                {
                                    (data.likes.includes(data.PostedBy)) ? (
                                        <Ionicons name ='heart' size = {25} color= {'#e6121d'}/>
                                    ):(
                                        <Ionicons name ='heart-outline' size = {25}/>
                                    )
                                }
                            </Pressable>
                        </View>


                    <View style = {{flexDirection:'row'}}>
                        {
                            (username !== data.PostedBy) ? (
                                <Pressable onPress= {() => navigation.navigate("view profile", {ProfileImage: data.profilePic, postedByUsername:data.PostedBy, currentUsername:username})}>
                                    <Image style = {{height:50, width:50, borderRadius:15, elevation:10, margin:12}} source = {{uri:data.profilePic, elevation:2}}/>
                                </Pressable>
                            ):(
                                <Image style = {{height:50, width:50, borderRadius:15, elevation:10, margin:12}} source = {{uri:data.profilePic, elevation:2}}/>
                            )
                        }


                        <View>
                            <Text style = {{fontSize:15, fontWeight:'bold', color:'white', elevation:1, paddingTop:5}}>{data.title}</Text>
                            <View style = {{flexDirection:'row', alignItems:'center'}}>
                                <Image style = {{height:20, width:20, marginTop:4, borderRadius:20}} source = {{uri:data.currency}}/>
                                <Text style = {{color:'white', fontSize:15, elevation:1, margin:5, fontWeight:'500'}}>{data.price} </Text>
                            </View>
                            <Text style = {{ color:'white', fontSize:15, elevation:1, fontWeight:'500' }}>${Number(data.USD).toLocaleString('en-US')}</Text>
                        </View>
                    </View>


                    <ScrollView horizontal showsHorizontalScrollIndicator= {false} style = {{ position: 'absolute', top:215, width:"100%"}} >
                        <View style = {{flexDirection:'row', alignItems:'center'}}>
                            {
                                data.pic.map((i, k) =>(
                                    <Pressable key= {k} onPress= {() => {setIndex(k)}}>
                                        <Image source = {{uri:i}} style = {k===index?{height:60, width:60, margin:7, borderRadius:10}:{height:50, width:50, margin:7, borderRadius:10, alignContent:'center'}} key= {k}/>
                                    </Pressable>
                                ))
                            }
                        </View>
                    </ScrollView>
                    <View style = {{position: 'absolute', top:280, left:10}}>
                        {
                            (data.sold === "true") ? (
                                <View style = {{flexDirection:"row", alignItems:"center"}}>
                                    <View style = {{backgroundColor:"red", height:10, width:10, borderRadius:10}}></View>
                                    <Text style = {{color:"white", fontSize:12, paddingLeft:5, fontWeight:'600'}}>Sold</Text>
                                </View>
                            ):(
                                <View style = {{flexDirection:"row", alignItems:"center"}}>
                                    <View style = {{backgroundColor:"lightgreen", height:10, width:10, borderRadius:10}}></View>
                                    <Text style = {{color:"white", fontSize:12, paddingLeft:5, fontWeight:'600'}}>Available</Text>
                                </View>
                            )
                        }
                    </View>

                </ImageBackground>
            </View>
        </View>
    )
}
