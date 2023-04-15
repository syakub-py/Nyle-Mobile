import * as React from 'react';
import { View, Text, FlatList, Image, Pressable, TextInput, Alert, RefreshControl } from 'react-native';
import PostCard from './Components/PostCard.js';
import CategoryCard from './Components/CategoryCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {collection, getDocs} from 'firebase/firestore/lite'
import {firestoreLite} from './Components/Firebase'

export default function Home({navigation, route}) {
  // State variables using React Hooks:
  const [filteredData, setfilterData] = React.useState([]);
  const [masterData, setMasterData] = React.useState([]);
  const [search, setSearch] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  // Function to refresh the data
  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    // Retrieve posts from the database and update the state variables
    getPosts().then((result) =>{
      const masterPostList = result
      setfilterData(masterPostList);
      setMasterData(masterPostList);
    }).catch((error)=>{
      Alert.alert(error)
    })
    // Wait for 0.3 seconds before setting the refreshing state to false
    setTimeout(() => setRefreshing(false), 300);
  };

  // Function to retrieve posts from the database
  const getPosts = async ()=>{
    let results =[];
    const postCollection = collection(firestoreLite, "AllPosts");
    const postSnapshot = await getDocs(postCollection);
    // Iterate through each document and push the data to the results array
    postSnapshot.forEach(doc => {
      results.push(doc.data())
    });
    // Sort the results by date in descending order
    if (results){
      results = results.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    }
    return results;
  }

  // Effect hook to retrieve posts from the database on component mount
  React.useEffect(()=>{
    getPosts().then((result) =>{
      const masterPostList = result
      setfilterData(masterPostList);
      setMasterData(masterPostList);
    }).catch((error)=>{
      Alert.alert(error)
    })

  }, [])

  // Function to filter the data based on search input
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
                  <Image resizeMode='cover' source={{uri: route.params.profilePicture}} style={{height:70, width:70, borderRadius:100}}/>
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
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{color:'black', fontWeight:'bold', fontSize:20, paddingHorizontal:20}}>Trending Posts</Text>

                <Pressable style={{position:'absolute', right:25}}>
                  <Ionicons name='filter-outline' size={25} />
                </Pressable>

              </View>
            </View>


        //     <View>
        //     <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:20,}}>
        //     <Image source={require('../Screens/Components/icon.png')} style={{height:100, width:100, marginLeft:20}}/>

        //       <View style={{marginTop:20, marginRight:20}}>
        //         <Image resizeMode='cover' source={{uri:"https://randomuser.me/api/portraits/men/94.jpg"}} style={{height:70, width:70, borderRadius:100}}/>
        //       </View>
        //     </View>
        //       <View style={{
        //           flex: 1,
        //           flexDirection: 'row',
        //           justifyContent: 'center',
        //           alignItems: 'center',
        //           backgroundColor: '#fff',
        //           height:60,
        //           borderRadius:50,
        //           margin:10,
        //           elevation:2
        //         }}>
        //       <Ionicons name="search-outline" style={{paddingLeft: 25}} size={25} color ={'gray'}/>
        //       <TextInput placeholder='Search Nyle...' value={search} onChangeText={(text) => searchFilter(text)} placeholderTextColor={'gray'} style={{flex:1, fontWeight:'400', backgroundColor:'white', margin:10, borderRadius:20, paddingHorizontal:5,}}/>
        //     </View>
        //   <View>
        //     <ScrollView scrollEventThrottle={16}>
        //       <View>
        //         <Text style={{fontSize: 20, fontWeight:'bold', paddingHorizontal:20}}>Categories</Text>
        //       </View>
        //       <View style={{height:130, marginTop: 10}}>
        //         <ScrollView
        //         horizontal
        //         showsHorizontalScrollIndicator = {false}>
        //           <Pressable onPress={() => navigation.navigate('categories', {Posts:TechPosts})}>
        //             <CategoryCard IconName={'hardware-chip-outline'} />
        //           </Pressable>

        //           <Pressable onPress={() => navigation.navigate('categories', { Posts:CarPosts})}>
        //             <CategoryCard IconName={'car-sport-outline'} />
        //           </Pressable>

        //           <Pressable onPress={() => navigation.navigate('categories', {Posts:HomePosts})}>
        //             <CategoryCard IconName={'home-outline'} />
        //           </Pressable>

        //           <Pressable onPress={() => navigation.navigate('categories', {Posts:BikePosts})}>
        //             <CategoryCard IconName={'bicycle-outline'}/>
        //           </Pressable>

        //           {/* <Pressable onPress={() => navigation.navigate('categories', {Posts:AppliencePosts})}>
        //             <CategoryCard imageUri ={require("./CategoryImages/fridge.jpg")}/>
        //           </Pressable> */}
                  
        //         </ScrollView>
        //       </View>
        //     </ScrollView>
        //   </View>
        // </View>

          }

          data={filteredData}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem = {({item}) => (
            <Pressable onPress={() => navigation.navigate("post details", {PostTitle: item.title,Price:item.price, Details:item.details, Description:item.description, images:item.pic, Currency:item.currency, Location: item.location, PostedByProfilePic:item.profilePic, DatePosted:item.date, postedBy:item.PostedBy, coordinates:item.coordinates, username:route.params.username, views:item.views, sold:item.sold, CurrentUserProfilePic:route.params.profilePicture})}>
              <PostCard data ={item}/>
            </Pressable>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
}
  
