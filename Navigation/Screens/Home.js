import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
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
import _ from "lodash";
import Slider from "./Components/HomeComponents/Slider";

/*
  @route.params = {profilePicture: current profile picture, username: current username}
*/

const categories = ["All","Tech", "Auto", "Homes", "Bikes", "Bike Parts", "Jewelry","Retail/Wholesale"]
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

export default function Home({navigation, route}) {
  const [filteredData, setFilterData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [profilePic, setProfilePic] = useState(null)
  const [lastDocument, setLastDocument] = useState(null)
  const [loading, setLoading] = useState(false)
  const username = route.params.username

  useEffect( () => {
    readDatabase("AllPosts", setFilterData, setMasterData, setLastDocument)
    getProfilePicture(username).then((result)=>{
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
      <Pressable onPress = {() =>navigation.navigate("Home Map View", {username:username})}
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
                  <Text style={{fontWeight:'500', color:"grey"}}>{username}</Text>
                </View>
                <Pressable onPress={()=>{navigation.navigate("My Profile", {username: username})}}>
                  <Image
                      resizeMode="cover"
                      source={{uri: profilePic}}
                      style={{height: 50, width: 50, borderRadius: 15, elevation: 2}}
                  />
                </Pressable>

              </View>

              <Slider inputArray={categories} masterData={masterData} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} filter={categoryFilter} setFilterData={setFilterData} />

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

            </View>
          }

        data = {filteredData}
        refreshControl = {
          <RefreshControl refreshing = {refreshing} onRefresh = {()=>onRefresh(setRefreshing,setFilterData, setMasterData, setLastDocument)} />
        }
        renderItem = {({item}) => (
          <Pressable onPress = {() => navigation.navigate("post details", {CurrentUserProfilePic:profilePic, username:username, item})}>
            <PostCard data = {item} username = {username}/>
          </Pressable>
        )}
        keyExtractor = {item => item.id}
        onEndReached={()=>{
          if (_.size(masterData)>1){
            handleEndReached(filteredData, lastDocument, setFilterData, setMasterData, setLastDocument, setLoading)
          }
        }}
        />
      </View>
    </View>
  );
}
