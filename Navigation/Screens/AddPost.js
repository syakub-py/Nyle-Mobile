import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, RefreshControl, ScrollView,TextInput, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import faker from 'faker';
import {firestore} from './Components/Firebase'



export default function AddPost({route}){
    faker.seed(20);

    const [refresh, setRefreshing] = React.useState(false);
    const [title, setTitle] = React.useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const addPosts = (collectionPath, title) =>{
        if (!collectionPath) {
            throw new Error('Error: collection name cannot be empty');
        }
        return firestore.collection(collectionPath).doc(title).set({
            id:faker.random.number({min:1, max:100}),
            title: title,
            price: faker.random.number({min:1, max:100}),
            currency: "https://w7.pngwing.com/pngs/368/176/png-transparent-ethereum-cryptocurrency-blockchain-bitcoin-logo-bitcoin-angle-triangle-logo-thumbnail.png",
            location: faker.address.state(),
            details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
            description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
            pic:["https://photos.zillowstatic.com/fp/37e63bdbc4f81984c6aa3fa7cc704e54-uncropped_scaled_within_1536_1152.webp"],
            profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
            date: new Date().toLocaleString(),
        })
        .then(ref => {
        console.log('Added document with ID: ' + title);
        })
        .catch(error => {
        console.log('Error adding document: ', error);
        });
    }

    return(
        <SafeAreaView>
            <ScrollView refreshControl={<RefreshControl refreshing ={refresh} onRefresh={onRefresh}/>} >
                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Title</Text>
                    <TextInput placeholder='Enter Title' style={styles.textinput} onChangeText = {(result) => setTitle(result)}/>
                </View>

                <Pressable>
                    <View style={{backgroundColor:'lightgray', margin:20, borderRadius:15}}>
                        <Ionicons name = {'aperture-outline'} size={250} style={{alignSelf:'center', color:'gray'}}/>
                    </View>
                </Pressable>
                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Price</Text>
                    <TextInput placeholder='Enter price of item' style={styles.textinput}/>
                </View>
                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20}}>Details</Text>
                    <TextInput placeholder='Enter Details of item' style={styles.textinput}/>
                </View>
                <View>
                    <Text  style={{fontSize:35, fontWeight:'bold', color:'black',margin:20,}}>Description</Text>
                    <TextInput placeholder='Enter full description of item' style={styles.textinput}/>
                </View>
                <Pressable onPress={()=> {addPosts("Users/"+route.params.username+"/Posts", title)}}>
                <View style={{margin:10, backgroundColor:"black", borderRadius: 20, alignItems:"center"}}>
                    <Text style={{margin:20, color:"white", fontWeight:"bold"}}>Add a post (for testing purposes only)</Text>
                </View>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textinput:{
        backgroundColor:'lightgray',
        color:'gray',
        marginLeft:35,
        marginRight:35,
        fontSize:15,
        fontWeight:'600',
        height:50,
        borderRadius:10,
        paddingHorizontal:15,
    },
  });