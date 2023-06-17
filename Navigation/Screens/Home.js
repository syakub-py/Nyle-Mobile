import React, {useState, useEffect} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import PostCard from './Components/PostCard.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firestore, getstorage} from './Components/Firebase'
import * as ImagePicker from "expo-image-picker";
import {getPosts, categoryFilter} from "./GlobalFunctions";

/*
  @route.params = {profilePicture: current profile picture, username: current username}
*/

const categories = ["All","Tech", "Auto", "Homes", "Bikes", "Bike Parts", "Jewelry","Retail/Wholesale"]
const postFilters = ["Trending", "Latest Posts", "Most Expensive", "Cheapest", "Top Rated Sellers", "Most Liked", "Sold"]
const {width} = Dimensions.get("window");

// Function to refresh the data
const onRefresh = (setRefreshing, setFilterData, setMasterData) => {
  // Set the refreshing state to true
  setRefreshing(true);
  // Retrieve posts from the database and update the state variables
  getPosts().then((result) => {
    const masterPostList = result
    setFilterData(masterPostList);
    setMasterData(masterPostList);
  }).catch((error) => {
    Alert.alert(error)
  })
  // Wait for 0.3 seconds before setting the refreshing state to false
  setTimeout(() => setRefreshing(false), 300);
};

const SelectProfilePic = async (username) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    aspect: [4, 3],
    quality: 1,
  });
  if (!result.canceled) {
    try {
      // Fetch the image and create a blob
      const response = await fetch(result.assets[0]);
      const blob = await response.blob();

      // Get a reference to the storage location for the profile image
      const storageRef = getstorage.ref(`ProfilePictures/${username}`);

      // Upload the new image to Firebase Storage
      await storageRef.put(blob);

      // Get the download URL for the uploaded image
      const url = await storageRef.getDownloadURL();

      // Find the document in the ProfilePictures collection that corresponds to the current user's profile image
      const profilePicRef = firestore.collection('ProfilePictures').where('FileName', '==', usernamee);

      // Update the URL for the profile image in the Firestore document
      profilePicRef.get().then((querySnapshot) => {
        if (querySnapshot.empty) {
          // Create the document if it doesn't exist
          firestore.collection('ProfilePictures').add({ FileName: username, url })
              .then(() => {
              })
              .catch((error) => {
                console.error('Error creating profile picture:', error);
              });
        } else {
          querySnapshot.forEach((doc) => {
            doc.ref.update({ url })
                .then(() => {
                })
                .catch((error) => {
                  console.error('Error updating profile picture:', error);
                });
          });
        }
      }).catch((error) => {
        console.error('Error getting document:', error);
      });
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  }
};

const handleCategoryPress = (index, setSelectedCategoryIndex, masterData, setFilterData, setCategorySearch) => {
  setSelectedCategoryIndex(index);
  categoryFilter(categories[index], masterData, setFilterData, setCategorySearch)
};

const handlePostFilterPress = (index, setSelectedPostFilterIndex, masterData, setFilterData) => {
  setSelectedPostFilterIndex(index);
  postFilter(postFilters[index], masterData, setFilterData)
};

// Function to filter the data based on search input
const searchFilter = (text, masterData, setFilterData, setSearch) => {
  if (text) {
    const newData = masterData.filter((item) => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase()
      const textData = text.toUpperCase();
      return itemData.indexOf(textData)>-1;
    });
    setFilterData(newData);
    setSearch(text);
  } else {
    setFilterData(masterData);
    setSearch(text);
  }
}

const postFilter = (text, masterData, setFilterData) => {
  if (text && text !== 'Latest Posts') {
    if (text === 'Most Expensive') {
      const newData = masterData.filter((item) => {
        const itemData = item.category ? item.category : '';
        return itemData.indexOf(text) > -1;
      });
      setFilterData(newData);
    }
    if (text === 'Trending') {
      const newData = masterData.sort((a, b) => {
        const viewsA = a.views ? a.views : 0;
        const viewsB = b.views ? b.views : 0;
        return viewsB - viewsA;
      });
      setFilterData(newData);
    }
    if (text === 'Cheapest') {
      const newData = masterData.sort((a, b) => {
        const priceA = a.price ? a.price : 0;
        const priceB = b.price ? b.price : 0;
        return priceA - priceB;
      });
      setFilterData(newData);
    }
  } else setFilterData(masterData);
};

export default function Home({navigation, route}) {
  const [filteredData, setFilterData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState([]);
  const [categorySearch, setCategorySearch] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedPostFilterIndex, setSelectedPostFilterIndex] = useState(0);

  useEffect(() => {
    getPosts().then((result) => {
      setFilterData(result);
      setMasterData(result);
    }).catch((error) => {
      Alert.alert(error)
    })
  }, [])

  return (
    <View style = {{flex:1, backgroundColor:'white'}}>

      <Pressable onPress = {() =>navigation.navigate("Home Map View", {CurrentUserProfilePic:route.params.profilePicture, username:route.params.username})}
        style = {{
        position: 'absolute',
        bottom: 90,
        left: width / 2 - 40,
        width: 80,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        zIndex: 1,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
        <View style = {{flexDirection: 'row'}}>
          <Ionicons
              name = "map"
              size = {15}
              style = {{ marginRight: 5 }}
          />
          <Text style = {{fontWeight:'bold'}}>Map</Text>
        </View>
      </Pressable>

      <View style = {{zIndex:0}}>
        <FlatList
        ListFooterComponent = {
          <View style = {{height:80}}>

          </View>
        }
        ListHeaderComponent = {
          <View>
              <View style = {{flexDirection:'row', justifyContent:'space-between', paddingTop:20, alignItems:'center'}}>
                <Image source = {require('../Screens/Components/icon.png')} style = {{height:75, width:75, marginLeft:20}}/>

                <Pressable onPress = {()=>SelectProfilePic(route.params.username)}>
                  <View style = {{marginTop:20, marginRight:20}}>
                    <Image resizeMode ='cover' source = {{uri: route.params.profilePicture}} style = {{height:50, width:50, borderRadius:100, elevation:2}}/>
                    <View style = {{backgroundColor:'black', height:20, width:20, borderRadius:10, zIndex:1, position: 'absolute',  bottom: 2, justifyContent:'center', alignItems:'center'}}>
                      <Ionicons name = {'add-outline'} color = {'white'} size = {17}/>
                    </View>
                  </View>
                </Pressable>

            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {{ paddingHorizontal: 15, paddingTop:10, paddingBottom:10}}>
              {
                categories.map((category, index) => (
                    <Pressable key = {index} 
                      onPress = {() => handleCategoryPress(index, setSelectedCategoryIndex, masterData, setFilterData, setCategorySearch)} 
                      style = {{backgroundColor: selectedCategoryIndex === index ? 'black' : 'whitesmoke', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginRight: 10}}
                    >
                      <Text style = {{color: selectedCategoryIndex === index ? '#ffffff' : '#000000', fontSize: 15, fontWeight:'500'}}>
                        {category}
                      </Text>
                    </Pressable>
                ))
              }
            </ScrollView>
            <View style = {{
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
              <Ionicons name = "search-outline" style = {{paddingLeft: 20}} size = {25} color = {'gray'}/>
              <TextInput placeholder ='Search Nyle...' value = {search} onChangeText = {(text) => searchFilter(text, masterData, setFilterData, setSearch)} placeholderTextColor = {'gray'} style = {{flex:1, fontWeight:'400', backgroundColor:'white', margin:10, paddingHorizontal:5,}}/>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {{ paddingHorizontal: 15, paddingTop:10, paddingBottom:10}}>
              {
                postFilters.map((filters, index) => (
                    <Pressable key = {index} onPress = {() => handlePostFilterPress(index, setSelectedPostFilterIndex, masterData, setFilterData)} style = {{backgroundColor: selectedPostFilterIndex === index ? 'black' : 'whitesmoke', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginRight: 10}}>
                      <Text style = {{color: selectedPostFilterIndex === index ? '#ffffff' : '#000000', fontSize: 15, fontWeight:'500'}}>
                        {filters}
                      </Text>
                    </Pressable>
                ))
              }
            </ScrollView>

          </View>
        }

        data = {filteredData}
        refreshControl = {
          <RefreshControl refreshing = {refreshing} onRefresh = {()=>onRefresh(setRefreshing, setFilterData, setMasterData)} />
        }
        renderItem = {({item}) => (
          <Pressable onPress = {() => navigation.navigate("post details", {CurrentUserProfilePic:route.params.profilePicture, username:route.params.username, item})}>
            <PostCard data = {item} username = {route.params.username}/>
          </Pressable>
          )}
          keyExtractor = {item => item.id}
        />
      </View>
    </View>
  );
}
