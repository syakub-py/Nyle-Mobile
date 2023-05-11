import * as React from 'react';
import {View, Text, FlatList, Image, Pressable, TextInput, Alert, RefreshControl, ScrollView} from 'react-native';
import PostCard from './Components/PostCard.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {collection, getDocs} from 'firebase/firestore/lite'
import {firestoreLite, getstorage, firestore} from './Components/Firebase'
import * as ImagePicker from "expo-image-picker";

export default function Home({navigation, route}) {
  // State variables using React Hooks:
  const [filteredData, setfilterData] = React.useState([]);
  const [masterData, setMasterData] = React.useState([]);
  const [search, setSearch] = React.useState([]);
  const [categorySearch, setCategorySearch] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
  const categories = ["All","Tech", "Auto", "Homes", "Bikes", "Bike Parts", "Jewelry","Retail/Wholesale"]

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

  const SelectProfilePic = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      // Fetch the image and create a blob
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      // Get a reference to the storage location for the profile image
      const storageRef = getstorage.ref().child(`ProfileImages/${route.params.username}`);

      // Upload the image to Firebase Storage
      await storageRef.update(blob);
      console.log("Profile Image uploaded successfully!");

      // Get the download URL for the uploaded image
      const url = await storageRef.getDownloadURL();

      // Find the document in the ProfilePictures collection that corresponds to the current user's profile image
      const ProfilePicRef = firestore.collection('ProfilePictures').where('FileName', '==', route.params.username);

      // Update the URL for the profile image in the Firestore document
      ProfilePicRef.get().then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          doc.ref.update({ url: url })
              .then(() => {
                console.log('Profile picture updated');
              })
              .catch((error) => {
                console.error('Error updating profile picture:', error);
              });
        });
      }).catch((error) => {
        console.error('Error getting document:', error);
      });
    }
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

  const handleCategoryPress = (index) => {
    setSelectedCategoryIndex(index);
    categoryFilter(categories[index])
  };

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

  const categoryFilter = (text) => {
    if (text && text !== 'All'){
      const newData = masterData.filter((item) =>{
        const itemData = item.category ? item.category : ''
        const textData = text;
        return itemData.indexOf(textData)>-1;
      });
      setfilterData(newData);
      setCategorySearch(text);
    }else{
      setfilterData(masterData);
      setCategorySearch(text);
    }
  }
  return (
      <View style={{flex:1, backgroundColor:'white'}}>
        <View style={{zIndex:0}}>
          <FlatList
          ListFooterComponent={
            <View style={{height:80}}>

            </View>
          }
          ListHeaderComponent={
            <View>
                <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:20,alignItems:'center'}}>
                  <Image source={require('../Screens/Components/icon.png')} style={{height:75, width:75, marginLeft:20}}/>

                  {/*add the logic to change the profile pic in firebase*/}
                  <Pressable onPress={()=>SelectProfilePic()}>
                    <View style={{marginTop:20, marginRight:20}}>
                      <Image resizeMode='cover' source={{uri: route.params.profilePicture}} style={{height:50, width:50, borderRadius:100, elevation:2}}/>
                      <View style={{backgroundColor:'black', height:20, width:20, borderRadius:10, zIndex:1, position: 'absolute',  bottom: 2, justifyContent:'center', alignItems:'center'}}>
                        <Ionicons name={'add-outline'} color={'white'} size={17}/>
                      </View>
                    </View>
                  </Pressable>

              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15, paddingTop:10, paddingBottom:10}}>
                {
                  categories.map((category, index) => (
                      <Pressable key={index} onPress={() => handleCategoryPress(index)} style={{backgroundColor: selectedCategoryIndex === index ? 'black' : 'whitesmoke', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginRight: 10}}>
                        <Text style={{color: selectedCategoryIndex === index ? '#ffffff' : '#000000', fontSize: 15, fontWeight:'500'}}>
                          {category}
                        </Text>
                      </Pressable>
                  ))
                }
              </ScrollView>
              <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    height:50,
                    borderRadius:15,
                    margin:10,
                    elevation:2
                  }}>
                <Ionicons name="search-outline" style={{paddingLeft: 20}} size={25} color ={'gray'}/>
                <TextInput placeholder='Search Nyle...' value={search} onChangeText={(text) => searchFilter(text)} placeholderTextColor={'gray'} style={{flex:1, fontWeight:'400', backgroundColor:'white', margin:10, paddingHorizontal:5,}}/>
              </View>

              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{color:'black', fontWeight:'bold', fontSize:20, paddingHorizontal:20}}>Latest Posts</Text>

                <Pressable style={{position:'absolute', right:25}}>
                  <Ionicons name='filter-outline' size={25} />
                </Pressable>

              </View>

            </View>
          }

          data={filteredData}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem = {({item}) => (
            <Pressable onPress={() => navigation.navigate("post details", {PostTitle: item.title,Price:item.price, USD:item.USD, Details:item.details, Description:item.description, images:item.pic, Currency:item.currency, Location: item.location, PostedByProfilePic:item.profilePic, DatePosted:item.date, postedBy:item.PostedBy, coordinates:item.coordinates, username:route.params.username, views:item.views, Likes:item.likes,sold:item.sold, CurrentUserProfilePic:route.params.profilePicture})}>
              <PostCard data ={item} username={route.params.username}/>
            </Pressable>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
}