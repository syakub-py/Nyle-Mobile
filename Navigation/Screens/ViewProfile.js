import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Pressable,Dimensions, ScrollView } from 'react-native';
import React from "react";
import PostCard from './Components/PostCard';
import { useNavigation } from '@react-navigation/native';
import {firestore} from "./Components/Firebase";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ViewProfile({route}){
    const navigation = useNavigation();
    const [UsersPosts, setUserPosts] = React.useState([])
    const getPosts = async () => {
        const results = [];
        const MyPostsQuery =  firestore.collection('AllPosts').where("PostedBy", "==", route.params.username)
        await MyPostsQuery.get().then(postSnapshot =>{
            postSnapshot.forEach(doc => {
                results.push(doc.data())
            });
        })
        return results;
    }

    React.useEffect(()=>{
        getPosts().then((result)=>{
            setUserPosts(result)
        })
    },[])

    const getSoldItems = () =>{
        var counter =0
        for (let i = 0; i < UsersPosts.length; i++) {
            if (UsersPosts[i].sold === 'true'){
                counter++
            }
        }
        return counter
    }
    
    return(
        <SafeAreaView>
            <View>
                <FlatList
                ListHeaderComponent={
                    <View>
                        <View style={{ height:50, width:50, backgroundColor:'transparent', alignItems:'center', justifyContent:'center', marginRight:20, marginTop:20}}>
                            <Pressable onPress={()=>navigation.goBack()}>
                                <Ionicons name='arrow-back-outline' size={35}/>
                            </Pressable>
                        </View>

                        <View style={{alignItems:'center', paddingTop:60}}>
                            <Image resizeMode='cover' source={{uri: route.params.ProfileImage}} style={{height:200, width:200, borderRadius:100}}/>
                            <View>
                                <Text style={{fontSize:25, fontWeight:'700', paddingTop:10}}>{route.params.username}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row', alignSelf:'center', paddingTop:10}}>
                            <View style={{flexDirection:'column', alignItems:'center'}}>
                                <Ionicons size={20} name={'star'} color={'#ebd61e'}/>
                                <Text style={{fontSize:17, fontWeight:'bold', paddingRight:5}}>4.9</Text>
                            </View>

                            <View style={{borderRightWidth: 1, borderColor: 'lightgray', height: '100%', marginLeft:10, marginRight:10}} />

                            <View style={{flexDirection:'column', alignItems:'center'}}>
                                <Text style={{fontSize:20, fontWeight:'500'}}>{UsersPosts.length}</Text>
                                <Text style={{fontSize:15, fontWeight:'400', color:'lightgray'}}>Posts</Text>
                            </View>

                            <View style={{borderRightWidth: 1, borderColor: 'lightgray', height: '100%',marginLeft:10, marginRight:10}} />

                            <View style={{flexDirection:'column', alignItems:'center'}}>
                                <Text style={{fontSize:20, fontWeight:'500'}}>{getSoldItems()}</Text>
                                <Text style={{fontSize:15, fontWeight:'400', color:'lightgray'}}>Sold items</Text>
                            </View>
                        </View>

                        <Text style={{margin:20, fontSize:20, fontWeight:'500'}}>Posts</Text>

                    </View>
                }
                data = {UsersPosts}
                renderItem = {({item}) => (
                    <View>
                        <PostCard data ={item}/>
                    </View>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}