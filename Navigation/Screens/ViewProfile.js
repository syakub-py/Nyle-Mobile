import { View, Text, SafeAreaView, FlatList, Image, Pressable } from 'react-native';
import React, {useState, useEffect} from "react";
import PostCard from './Components/PostCard';
import { useNavigation } from '@react-navigation/native';
import {firestore} from "./Components/Firebase";
import Ionicons from "react-native-vector-icons/Ionicons";
import {generateRating} from "./GlobalFunctions";

/*
    @route.params = {ProfileImage: profile picture of current user, currentUsername: the current username, postedByUsername:the user that the posts were posted by}
*/

const getPosts = async (username, setUserPosts) => {
    const results = [];
    const MyPostsQuery =  firestore.collection('AllPosts').where("PostedBy", "==", username)
    await MyPostsQuery.get().then(postSnapshot => {
        postSnapshot.forEach(doc => {
            results.push(doc.data())
        });
    })
    setUserPosts(results)
}

const getSoldItems = (UsersPosts) => {
    let counter = 0
    for (let i = 0; i < UsersPosts.length; i++) {
        if (UsersPosts[i].sold === 'true') counter++
    }
    return counter
}

export default function ViewProfile({route}) {
    const navigation = useNavigation();
    const [UsersPosts, setUserPosts] = useState([])
    const [rating, setRating] = useState(0)

    useEffect(() => {
        getPosts(route.params.postedByUsername, setUserPosts)
        generateRating(route.params.postedByUsername).then((result) => {
            setRating(result.rating)
        })
    }, [])

    return (
        <SafeAreaView>
            <View>
                <FlatList
                ListHeaderComponent = {
                    <View>
                        <View style = {{ height:50, width:50, backgroundColor:'transparent', alignItems:'center', justifyContent:'center', marginRight:20, marginTop:20}}>
                            <Pressable onPress = {() =>navigation.goBack()}>
                                <Ionicons name ='arrow-back-outline' size = {35}/>
                            </Pressable>
                        </View>

                        <View style = {{alignItems:'center', paddingTop:10}}>
                            <Image resizeMode ='cover' source = {{uri: route.params.ProfileImage}} style = {{height:150, width:150, borderRadius:100}}/>
                            <View>
                                <Text style = {{fontSize:22, fontWeight:'700', paddingTop:10}}>{route.params.postedByUsername}</Text>
                            </View>
                        </View>

                        <View style = {{flexDirection:'row', alignSelf:'center', paddingTop:10}}>
                            <Pressable onPress = {() => {navigation.navigate("Reviews", {username: route.params.postedByUsername, currentUser: route.params.currentUsername})}}>
                                <View style = {{flexDirection:'column', alignItems:'center'}}>
                                    <Ionicons size = {20} name = {'star'} color = {'#ebd61e'}/>
                                    <Text style = {{fontSize:17, fontWeight:'bold', paddingRight:5}}>{rating.toFixed(1)}</Text>
                                </View>
                            </Pressable>
                            <View style = {{borderRightWidth: 1, borderColor: 'lightgray', height: '100%', marginLeft:10, marginRight:10}} />

                            <View style = {{flexDirection:'column', alignItems:'center'}}>
                                <Text style = {{fontSize:20, fontWeight:'500'}}>{UsersPosts.length}</Text>
                                <Text style = {{fontSize:15, fontWeight:'400', color:'lightgray'}}>Total Items</Text>
                            </View>

                            <View style = {{borderRightWidth: 1, borderColor: 'lightgray', height: '100%',marginLeft:10, marginRight:10}} />

                            <View style = {{flexDirection:'column', alignItems:'center'}}>
                                <Text style = {{fontSize:20, fontWeight:'500'}}>{getSoldItems(UsersPosts)}</Text>
                                <Text style = {{fontSize:15, fontWeight:'400', color:'lightgray'}}>Sold items</Text>
                            </View>
                        </View>

                        <Text style = {{margin:20, fontSize:20, fontWeight:'500'}}>Posts</Text>

                    </View>
                }
                data = {UsersPosts}
                renderItem = {({item}) => (
                    <View>
                        <PostCard data = {item}/>
                    </View>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}
