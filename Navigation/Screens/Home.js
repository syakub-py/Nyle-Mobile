import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
  Vibration,
  ActivityIndicator
} from 'react-native';
import PostCard from './Components/PostCard.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {readDatabase, categoryFilter, getProfilePicture} from "./GlobalFunctions";
import {handleEndReached} from "./GlobalFunctions";

/*
  @route.params = {profilePicture: current profile picture, username: current username}
*/

const categories = ["All","Tech", "Auto", "Homes", "Bikes", "Bike Parts", "Jewelry","Retail/Wholesale"]
const postFilters = ["Trending", "Latest Posts", "Most Expensive", "Cheapest", "Top Rated Sellers", "Most Liked", "Sold"]
const {width} = Dimensions.get("window");

// Function to refresh the data
const onRefresh = (setRefreshing,setFilterData, setMasterData, setLastDocument) => {
  // Set the refreshing state to true
  setRefreshing(true);
  // Retrieve posts from the database and update the state variables
  readDatabase("AllPosts", setFilterData, setMasterData, setLastDocument)
  Vibration.vibrate(100);

  // Wait for 0.3 seconds before setting the refreshing state to false
  setTimeout(() => setRefreshing(false), 300);
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
    switch (text) {
      case 'Most Expensive':
        const newDataMostExpensive = masterData.slice().sort((a, b) => (b.price || 0) - (a.price || 0));
        setFilterData(newDataMostExpensive);
        break;
      case 'Trending':
        const newDataTrending = masterData.slice().sort((a, b) => (b.views || 0) - (a.views || 0));
        setFilterData(newDataTrending);
        break;
      case 'Cheapest':
        const newDataCheapest = masterData.slice().sort((a, b) => (a.price || 0) - (b.price || 0));
        setFilterData(newDataCheapest);
        break;
      case 'Top Rated Sellers':
        const TopRatedMySellers = masterData.slice().sort((a, b) => (a.price || 0) - (b.price || 0));
        setFilterData(TopRatedMySellers);
        break;
      default:
        setFilterData(masterData);
        break;
    }
  } else {
    setFilterData(masterData);
  }
};

export default function Home({navigation, route}) {
  const [filteredData, setFilterData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState([]);
  const [categorySearch, setCategorySearch] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedPostFilterIndex, setSelectedPostFilterIndex] = useState(0);
  const [profilePic, setProfilePic] = useState(null)
  const [lastDocument, setLastDocument] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect( () => {
    readDatabase("AllPosts", setFilterData, setMasterData, setLastDocument)
    getProfilePicture(route.params.username).then((result)=>{
      setProfilePic(result)
    })
  }, [])

  const renderFooter = () => {
    if (!loading) {
      return (
          <View style = {{height:80}}>
          </View>
      );
    }

    return (
        <View style = {{height:200}}>
          <ActivityIndicator size="large" color="black" />
        </View>
    );
  };


  return (
    <View style = {{flex:1, backgroundColor:'white'}}>
      <Pressable onPress = {() =>navigation.navigate("Home Map View", {username:route.params.username})}
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
          showsVerticalScrollIndicator={false}
          ListFooterComponent = {renderFooter}
          ListHeaderComponent = {
            <View style={{flex:1}}>
              <View style={{marginTop: 35, marginRight: 15, flexDirection:'row', justifyContent:'space-between',}}>

                <View style={{marginLeft:15}}>
                  <Text style={{fontSize:17, fontWeight:'bold'}}>Welcome Back</Text>
                  <Text style={{fontWeight:'500', color:"grey"}}>{route.params.username}</Text>
                </View>
                <Pressable onPress={()=>{navigation.navigate("My Profile", {username: route.params.username})}}>
                  <Image
                      resizeMode="cover"
                      source={{uri: profilePic}}
                      style={{height: 50, width: 50, borderRadius: 15, elevation: 2}}
                  />
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
          <RefreshControl refreshing = {refreshing} onRefresh = {()=>onRefresh(setRefreshing,setFilterData, setMasterData, setLastDocument)} />
        }
        renderItem = {({item}) => (
          <Pressable onPress = {() => navigation.navigate("post details", {CurrentUserProfilePic:profilePic, username:route.params.username, item})}>
            <PostCard data = {item} username = {route.params.username}/>
          </Pressable>
        )}
        keyExtractor = {item => item.id}
        onEndReached={()=>{handleEndReached(filteredData, lastDocument, setFilterData, setMasterData, setLastDocument, setLoading)}}
        />
      </View>
    </View>
  );
}
