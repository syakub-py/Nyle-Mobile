import * as React from 'react';
import { View, Text, FlatList, Image, ScrollView, Pressable, TextInput, Alert, RefreshControl } from 'react-native';
import PostCard from './Components/PostCard.js';
import CategoryCard from './Components/CategoryCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {collection, getDocs} from 'firebase/firestore/lite'
import {firestoreLite} from './Components/Firebase'

export default function Home({navigation, route}) {
  
  const [filteredData, setfilterData] = React.useState([]);
  const [masterData, setMasterData] = React.useState([]);
  const [profilePic, setProfilePic] = React.useState('');
  const [search, setSearch] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    getPosts().then((result) =>{
      const masterPostList = result
      setfilterData(masterPostList);
      setMasterData(masterPostList);
    }).catch((error)=>{
      Alert(error)
    })
    setTimeout(() => setRefreshing(false), 1000);
  };
  
  const getPosts = async ()=>{
    const results =[];
    const postCollection = collection(firestoreLite, "AllPosts");
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
      <View style={{flex:1, backgroundColor:'white'}}>
        <View style={{zIndex:0}}>
          <FlatList
          ListHeaderComponent={
            <View>
            <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:20,}}>
            <Image source={require('../Screens/Components/icon.png')} style={{height:100, width:100, marginLeft:20}}/>

              <View style={{marginTop:20, marginRight:20}}>
                <Image resizeMode='cover' source={{uri:"https://randomuser.me/api/portraits/men/94.jpg"}} style={{height:70, width:70, borderRadius:100}}/>
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
                  elevation:2
                }}>
              <Ionicons name="search-outline" style={{paddingLeft: 25}} size={25} color ={'gray'}/>
              <TextInput placeholder='Search Nyle...' value={search} onChangeText={(text) => searchFilter(text)} placeholderTextColor={'gray'} style={{flex:1, fontWeight:'400', backgroundColor:'white', margin:10, borderRadius:20, paddingHorizontal:5,}}/>
            </View>
          <View>
            <ScrollView scrollEventThrottle={16}>
              <View>
                <Text style={{fontSize: 20, fontWeight:'bold', paddingHorizontal:20}}>Categories</Text>
              </View>
              <View style={{height:130, marginTop: 10}}>
                <ScrollView
                horizontal
                showsHorizontalScrollIndicator = {false}>
                  <Pressable onPress={() => navigation.navigate('categories', {Posts:TechPosts})}>
                    <CategoryCard IconName={'hardware-chip-outline'} />
                  </Pressable>

                  <Pressable onPress={() => navigation.navigate('categories', { Posts:CarPosts})}>
                    <CategoryCard IconName={'car-sport-outline'} />
                  </Pressable>

                  <Pressable onPress={() => navigation.navigate('categories', {Posts:HomePosts})}>
                    <CategoryCard IconName={'home-outline'} />
                  </Pressable>

                  <Pressable onPress={() => navigation.navigate('categories', {Posts:BikePosts})}>
                    <CategoryCard IconName={'bicycle-outline'}/>
                  </Pressable>

                  {/* <Pressable onPress={() => navigation.navigate('categories', {Posts:AppliencePosts})}>
                    <CategoryCard imageUri ={require("./CategoryImages/fridge.jpg")}/>
                  </Pressable> */}
                  
                </ScrollView>
              </View>
            </ScrollView>
            <Text style={{color:'black', fontWeight:'bold', fontSize:20, paddingHorizontal:20}}>Trending Posts</Text>
          </View>
        </View>
          }
          data={filteredData}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem = {({item}) => (
            <Pressable onPress={() => navigation.navigate("post details", {PostTitle: item.title,Price:item.price, Details:item.details, Description:item.description, images:item.pic, Currency:item.currency, Location: item.location, ProfilePic:item.profilePic, DatePosted:item.date, postedBy:item.PostedBy, coordinates:item.coordinates})}>
              <PostCard data ={item}/>
            </Pressable>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
}
  
