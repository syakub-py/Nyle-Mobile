import {Image, ImageBackground, Pressable, ScrollView, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {firestore} from "./Firebase";
import axios from "axios";

export default function PostCard({data, username}){
    const navigation = useNavigation();
    const [liked,setLiked] = React.useState(false)
    const [price, setPrice] = React.useState(0)
    const [index, setIndex] = React.useState(0)
    const handleLike = async () => {
        const PostRef = firestore.collection('AllPosts').doc(data.title);
        setLiked(!liked)
        PostRef.get()
            .then((doc) => {
                if (doc.exists && !doc.data().likes.includes(username)) {
                    const likesArray = doc.data().likes || [];
                    // Modify the array as needed
                    likesArray.push(username);
                    // Write the updated array back to the document
                    PostRef.update({ likes: likesArray })
                        .then(() => {
                            console.log('Liked!');
                        })
                        .catch((error) => {
                            console.error('Error adding Like:', error);
                        });
                } else {
                    const likesArray = doc.data().likes || [];
                    const updatedLikesArray = likesArray.filter((user) => user !== username);
                    PostRef.update({ likes: updatedLikesArray })
                        .then(() => {
                            console.log('Like removed');
                        })
                        .catch((error) => {
                            console.error('Error removing Like:', error);
                        });          }
            })
            .catch((error) => {
                console.error('Error getting document:', error);
            });
    };
    React.useEffect(()=>{
        const updateCurrencyPrice = async () => {
            try {
                const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d");
                const filteredData = response.data.filter((item) => item.image === data.currency)
                if (filteredData.length > 0) {
                    setPrice(filteredData[0].current_price)
                }
            } catch (error) {
                console.log(error.message);
            }

            const postRef = firestore.collection('AllPosts').doc(data.title);
            postRef.get().then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    if (data.hasOwnProperty('USD') && price !== 0) {
                        postRef.update({ USD:(price*data.price).toFixed(2).toString()});
                    } else {

                        if (price !== 0){
                            postRef.set({ USD:(price*data.price).toFixed(2).toString() }, { merge: true });
                        }

                    }
                }
            });
        }

        updateCurrencyPrice().then(()=>{})

    }, [data.currency])


    return (
        <View style = {{ backgroundColor: 'white', marginBottom: 10, margin: 10, borderRadius:10, elevation:3}}>
            <View style ={{width:"100%", height:300}}>
                <ImageBackground source={{uri: data.pic[index]}} imageStyle ={{width:"100%", height:300, borderRadius:10, resizeMode:'cover'}}>


                    <View style={{position:'absolute', right:10,top:10, backgroundColor:'white', height:40, width:40, borderRadius:12, justifyContent:'center', alignItems:'center', opacity:0.7}}>
                        <Pressable onPress={()=>handleLike()}>
                            {
                                (liked || data.likes.includes(data.PostedBy))?(
                                    <Ionicons name='heart' size={25} color={'#e6121d'}/>

                                ):(
                                    <Ionicons name='heart-outline' size={25}/>
                                )
                            }
                        </Pressable>
                    </View>


                    <View style={{flexDirection:'row'}}>
                        <Pressable onPress={() => navigation.navigate("view profile", {ProfileImage: data.profilePic, username:data.PostedBy})}>
                            <Image style={{height:50, width:50, borderRadius:15, elevation:10, margin:12}} source={{uri:data.profilePic, elevation:2}}/>
                        </Pressable>

                        <View>
                            <Text style ={{fontSize:15, fontWeight:'bold', color:'white', elevation:1, paddingTop:5}}>{data.title}</Text>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Image style={{height:20, width:20, marginTop:4, borderRadius:20}} source={{uri:data.currency}}/>
                                <Text style={{color:'white', fontSize:15, elevation:1, margin:5, fontWeight:'500'}}>{data.price} </Text>
                            </View>
                            <Text style={{ color:'white', fontSize:15, elevation:1, fontWeight:'500' }}>${Number(data.USD).toLocaleString('en-US')}</Text>
                        </View>
                    </View>


                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ position: 'absolute', top:225, width:"100%"}} >
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            {
                                data.pic.map((i, k)=>(
                                    <Pressable key={k} onPress={()=> {setIndex(k)}}>
                                        <Image source={{uri:i}} style={k===index?{height:60, width:60, margin:7, borderRadius:10}:{height:50, width:50, margin:7, borderRadius:10, alignContent:'center'}} key={k}/>
                                    </Pressable>
                                ))
                            }
                        </View>
                    </ScrollView>

                </ImageBackground>
            </View>
        </View>
    )
}

{/*/!*needs to get finished*!/*/}
{/*{*/}
{/*    (data.sold === "true")? (<View style={{ position: 'absolute', top:250, right: 0, backgroundColor: 'red', height: 30, width: 70, transform: [{ rotate: '-45deg' }],  justifyContent: 'center', alignItems: 'center' }}>*/}
{/*        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>SOLD</Text>*/}
{/*    </View>):(null)*/}
{/*}*/}
{/*<View style={{flexDirection:'row',  position: 'absolute', top:260, left: 7,}}>*/}
{/*    <View style={{*/}
{/*        flexDirection: 'row',*/}
{/*        backgroundColor: 'transparent',*/}
{/*        borderRadius: 5,*/}
{/*        margin: 5,*/}
{/*    }}>*/}
{/*        <Ionicons name='heart' size={20} color={'#e6121d'}/>*/}
{/*        <Text style={{*/}
{/*            color: 'white',*/}
{/*            fontSize: 12,*/}
{/*            fontWeight: 'bold',*/}
{/*            marginLeft: 3,*/}
{/*            marginTop: 3*/}
{/*        }}>{data.likes.length}</Text>*/}
{/*    </View>*/}
{/*    <View style={{  flexDirection: 'row',*/}
{/*        backgroundColor: 'transparent',*/}
{/*        borderRadius: 5,*/}
{/*        margin: 5,}}>*/}
{/*        <Ionicons name='eye' size={20} color={'white'}/>*/}
{/*        <Text style={{  color: 'white',*/}
{/*            fontSize: 12,*/}
{/*            fontWeight: 'bold',*/}
{/*            marginLeft: 3,*/}
{/*            marginTop: 3}}>{data.views}</Text>*/}
{/*    </View>*/}
{/*</View>*/}