import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground, ScrollView, Pressable, TextInput, Alert, RefreshControl } from 'react-native';
import PostCard from './Components/PostCard.js';
import CategoryCard from './Components/CategoryCard';
import faker from 'faker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {collection, getDocs} from 'firebase/firestore/lite'
import {firestore, firestoreLite} from './Components/Firebase'

export default function Home({navigation}) {
  const [filteredData, setfilterData] = React.useState([]);
  const [masterData, setMasterData] = React.useState([]);
  const [search, setSearch] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  // const[masterPostList, setMasterPostList] = React.useState([]);

  const onRefresh = () => {
    setRefreshing(true);
    // Call the API to refresh the data here
    getPosts().then((result) =>{
      const masterPostList = result
      setfilterData(masterPostList);
      setMasterData(masterPostList);
    }).catch((error)=>{
      Alert(error)
    })
    // After the data has been refreshed, set refreshing to false
    setTimeout(() => setRefreshing(false), 1000);
  };
  


  const getPosts = async ()=>{
    
    const results =[];
    const postCollection = collection(firestoreLite, "Posts");
    const postSnapshot = await getDocs(postCollection);
    postSnapshot.forEach(doc => {
      results.push(doc.data())
    });
    return results;
  }

  React.useEffect(()=>{
    getPosts().then((result) =>{
      const masterPostList = result
      setfilterData(masterPostList);
      setMasterData(masterPostList);
    }).catch((error)=>{
      Alert(error)
    })
  }, [])


  const addPosts = (collectionName) =>{
    if (!collectionName) {
        throw new Error('Error: collection name cannot be empty');
    }
    return firestore.collection(collectionName).add({
      title: faker.address.streetAddress(),
      price: "50",
      currency: "https://w7.pngwing.com/pngs/368/176/png-transparent-ethereum-cryptocurrency-blockchain-bitcoin-logo-bitcoin-angle-triangle-logo-thumbnail.png",
      location: "New York, NY",
      details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
      description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
      pic: 'https://images.squarespace-cdn.com/content/v1/58487dc4b8a79b6d02499b60/1650194082470-72Q6R35RXYETS0ZBRBL0/Francis+York+Iconic+Oceanfront+Estate+for+Sale+in+the+Hamptons%2C+NY+1.jpeg?format=1500w',
      profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
    })
    .then(ref => {
      console.log('Added document with ID: ', ref.id);
    })
    .catch(error => {
      console.log('Error adding document: ', error);
    });
  }

    const searchFilter = (text) => {
      if (text){
        const newData = masterData.filter((item) =>{
          const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase()
          const textData = text.toUpperCase();
          return itemData.indexOf(textData)>-1;
        });
        setfilterData(newData);
        setSearch(text);
      }else{
        setfilterData(masterData);
        setSearch(text);
      }
    }
    
    return (
      <SafeAreaView style={{flex:1}}>
        <View style={{flex:1}}>
          <View style={{zIndex:0}}>
            <FlatList
            ListHeaderComponent={
              <View>
              <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:20}}>
                <View style={{margin:20}}>
                  <Text style={{color:'gray', fontSize:15, fontWeight:'500'}}>Welcome back,</Text>
                  <Text style={{fontSize:25, fontWeight:'bold'}}>{faker.name.findName()}</Text>   
                </View>
                <View style={{margin:20}}>
                  <Image resizeMode='cover' source={{uri:`https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(100)}.jpg`}} style={{height:70, width:70, borderRadius:100}}/>
                </View>
              </View>
                <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                height:60,
                borderRadius:50,
                margin:10,
                elevation:3
            }}>
              <Ionicons name="search-outline" style={{paddingLeft: 30}} size={20}/>
              <TextInput placeholder='Search Nyle...' value={search} onChangeText={(text) => searchFilter(text)} placeholderTextColor={'gray'} style={{flex:1, fontWeight:'400', backgroundColor:'white', margin:10, borderRadius:100, paddingHorizontal:5,}}/>
            </View>
            <View>
              <ScrollView scrollEventThrottle={16}>
                <View>
                  <Text style={{fontSize: 19, fontWeight:'bold', paddingHorizontal:20}}>Categories</Text>
                </View>
                <View style={{height:130, marginTop: 20}}>
                  <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator = {false}>
                    <Pressable onPress={() => navigation.navigate('categories', {Posts:TechPosts})}>
                      <CategoryCard imageUri ={require("./CategoryImages/ipadPro.jpg")}/>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('categories', { Posts:CarPosts})}>
                      <CategoryCard imageUri ={require("./CategoryImages/2015-lamborghini-aventador.jpg")} />
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('categories', {Posts:HomePosts})}>
                      <CategoryCard imageUri ={require("./CategoryImages/house.jpg")}/>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('categories', {Posts:BikePosts})}>
                      <CategoryCard imageUri ={require("./CategoryImages/bike.jpg")}/>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('categories', {Posts:AppliencePosts})}>
                      <CategoryCard imageUri ={require("./CategoryImages/fridge.jpg")}/>
                    </Pressable>
                    
                  </ScrollView>
                </View>
              </ScrollView>
              <Text style={{color:'black', fontWeight:'bold', fontSize:19, paddingHorizontal:20}}>Top Posts</Text>
            </View>
            <Pressable onPress={()=> addPosts("Posts")}>
              <View style={{margin:10, backgroundColor:"black", borderRadius: 20, alignItems:"center"}}>
                <Text style={{margin:20, color:"white", fontWeight:"bold"}}>Add a post (for testing purposes only)</Text>
              </View>
            </Pressable>
          </View>
            }
            data={filteredData}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem = {({item}) => (
              <Pressable onPress={() => navigation.navigate("post details", {PostTitle: item.title,Price:item.price, Details:item.details, Description:item.description, images:[item.pic], Currency:item.currency, Location: item.location})}>
                <PostCard data ={item}/>
              </Pressable>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </SafeAreaView>
    );
}
  
