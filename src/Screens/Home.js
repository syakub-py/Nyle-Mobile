import React, {useState, useEffect, useContext} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import PostCard from '../Components/PostCard.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import Slider from '../Components/HomeComponents/Slider';
import {LoadingAnimation} from '../Components/LoadingAnimation';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../Contexts/NyleContext';
import {UserContext} from '../Contexts/UserContext';

const categories = ['All', 'Tech', 'Auto', 'Homes', 'Bikes', 'Bike Parts', 'Jewelry', 'Retail/Wholesale'];
const {width} = Dimensions.get('window');


export default function Home() {
  const nyleContext = useContext(AppContext);
  const userContext = useContext(UserContext);
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    nyleContext.readNextTwoElements('AllPosts').then((result)=>{
      setMasterData(result);
      setLoading(false);
    });
  }, []);

  const searchFilter = (text) => {
    if (text) {
      setSearch(text);
      return masterData.filter((item) => {
        const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData)>-1;
      });
    } else {
      setSearch(text);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    Vibration.vibrate(100);
    nyleContext.readNextTwoElements('AllPosts').then((result)=>{
      setMasterData(result);
      setRefreshing(false);
    });
  };

  const RenderFooter = () => {
    if (!loading) {
      return (
        <View style = {{height: 80}}>
        </View>
      );
    }

    return (
      <View style = {{height: 200}}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  };


  return (
    <View style = {{flex: 1, backgroundColor: 'white'}}>
      <LoadingAnimation loading={loading}/>
      <Pressable onPress = {() =>navigation.navigate('Home Map View', {username: userContext.username})}
        style = {{
          position: 'absolute',
          bottom: 110,
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
            style = {{marginRight: 5}}
          />
          <Text style = {{fontWeight: 'bold'}}>Map</Text>
        </View>
      </Pressable>

      <View style = {{zIndex: 0}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListFooterComponent = {RenderFooter}
          ListHeaderComponent = {
            <View style={{flex: 1}}>
              <View style={{marginTop: 35, marginRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>

                <View style={{marginLeft: 15}}>
                  <Text style={{fontSize: 17, fontWeight: 'bold'}}>Welcome Back</Text>
                  <Text style={{fontWeight: '500', color: 'grey'}}>{userContext.username}</Text>
                </View>
                <Pressable onPress={()=>{
                  navigation.navigate('My Profile');
                }}>
                  <Image
                    resizeMode="cover"
                    source={{uri: userContext.profilePicture}}
                    style={{height: 50, width: 50, borderRadius: 15}}
                  />
                </Pressable>

              </View>

              <Slider inputArray={categories} masterData={masterData} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} filter={nyleContext.categoryFilter} />

              <View style = {{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                height: 50,
                borderRadius: 15,
                margin: 10,
                elevation: 2,
              }}>
                <Ionicons name = "search-outline" style = {{paddingLeft: 20}} size = {25} color = {'gray'}/>
                <TextInput placeholder ='Search Nyle...' value = {search} onChangeText = {(text) => setMasterData(searchFilter(text))} placeholderTextColor = {'gray'} style = {{flex: 1, fontWeight: '400', backgroundColor: 'white', margin: 10, paddingHorizontal: 5}}/>
              </View>

            </View>
          }

          data = {masterData}
          refreshControl = {
            <RefreshControl refreshing = {refreshing} onRefresh = {()=>onRefresh()} />
          }
          renderItem = {({item}) => (
            <PostCard title = {item.title}/>
          )}
          keyExtractor = {(item) => item.id}
          onEndReached={()=>{
            if (_.size(masterData)>1) {
              nyleContext.handleEndOfScreenReached();
            }
          }}
        />
      </View>
    </View>
  );
}
