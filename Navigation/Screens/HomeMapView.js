import {Dimensions, FlatList, Image, Pressable, ScrollView, Text, TextInput, View} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import React, {useState, useEffect} from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import {readDatabase, getCityState, categoryFilter, getProfilePicture} from "./GlobalFunctions";
import CustomMapMarker from "./Components/CustomMapMarker";
import MapPostCard from "./Components/MapPostCard";
const {width} = Dimensions.get("window");

const categories = ["All","Tech", "Auto", "Homes", "Bikes", "Bike Parts", "Jewelry","Retail/Wholesale"]

const handleCategoryPress = (index, setSelectedCategoryIndex, masterData, setFilterData, setCategorySearch) => {
    setSelectedCategoryIndex(index);
    categoryFilter(categories[index], masterData, setFilterData, setCategorySearch)
};

export default function HomeMapView({navigation, route}) {
    const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilterData] = useState([]);
    const [categorySearch, setCategorySearch] = useState([]);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [profilePic, setProfilePic] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset;
        const currentIndex = Math.floor(contentOffset.x / 245);

        setCurrentIndex(currentIndex);
    };

    useEffect(() => {
        readDatabase("AllPosts",setMasterData, setFilterData)

        getCityState(40.735081, -73.759658, setState, setCity)
        getProfilePicture(route.params.username).then((result)=>{
            setProfilePic(result)
        })

    }, [])

    return (
        <View style = {{ flex: 1 }}>
            <View style = {{zIndex:1}}>
                <View style = {{position: 'absolute', top: 30, left: 15, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:13,  alignItems:'center', justifyContent:'center'}}>
                       <Pressable onPress = {() =>navigation.goBack()}>
                           <Ionicons name ='chevron-back-outline' size = {30}/>
                       </Pressable>
                </View>


                <View style = {{position: 'absolute', alignSelf:'center', height:100, width:130, backgroundColor:'transparent',  alignItems:'center', justifyContent:'center', flexDirection:"row"}}>
                        <Ionicons name ='location' size = {30} style = {{marginRight:5}} color = {"red"}/>
                        <Text style = {{fontSize:18, fontWeight:'bold'}}>{city}, {state}</Text>
                </View>

                <View style = {{position: 'absolute', top: 30, right: 15, height:50, width:50, backgroundColor:'transparent',   alignItems:'center', justifyContent:'center'}}>
                    <Image source={{uri:profilePic}} style={{borderRadius:13, height:"100%", width:"100%"}}/>
                </View>
            </View>

            <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex:1}}>
                <View style = {{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    height: 50,
                    borderRadius: 15,
                    margin: 10,
                    elevation: 2,
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    zIndex: 1,
                    position: 'absolute',
                    top: 80,
                    width: '95%',
                }}>
                    <Ionicons name = "search-outline" style = {{ paddingLeft: 20 }} size = {25} color ='gray' />
                    <TextInput
                        placeholder ='Search Nyle...'
                        placeholderTextColor ='gray'
                        style = {{
                            flex: 1,
                            fontWeight: '400',
                            backgroundColor: 'transparent',
                            margin: 10,
                            paddingHorizontal: 5,
                            fontSize: 16,
                            color: 'black'
                        }}
                    />
                </View>

            </View>
            <View style = {{zIndex:1, position:'absolute', top:140}}>
                <ScrollView horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {{ paddingHorizontal: 15, paddingTop:10, paddingBottom:10, backgroundColor:'transparent'}}>
                    {categories.map((category, index) => (
                            <Pressable key = {index} onPress = {() => handleCategoryPress(index, setSelectedCategoryIndex, masterData, setFilterData, setCategorySearch)} style = {{backgroundColor: selectedCategoryIndex === index ? 'black' : 'white', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginRight: 10}}>
                                <Text style = {{color: selectedCategoryIndex === index ? '#ffffff' : 'gray', fontSize: 15, fontWeight:'400'}}>
                                    {category}
                                </Text>
                            </Pressable>
                        ))
                    }
                </ScrollView>
            </View>


            <MapView style = {{ height: "100%", width: "100%" }} initialCamera = {{center: {latitude:40.849113,longitude:-101.325992}, pitch: 0,heading:0,zoom: 1, altitude:0}}>
                {filteredData.map((item, index) => (
                    <View key = {index}>
                        <Marker coordinate = {item.coordinates}>
                            <CustomMapMarker firstImage = {item.pic[0]} />
                        </Marker>

                        <Circle
                            center = {item.coordinates}
                            radius = {1200}
                            fillColor = "rgba(66, 135, 245, 0.2)"
                            strokeColor = "rgba(66, 135, 245, 0.7)"
                            strokeWidth = {1}
                        />
                    </View>
                ))}
            </MapView>

            <View style = {{ position: 'absolute', bottom: 10, width: '100%'}}>
                <FlatList
                    data={filteredData}
                    horizontal
                    pagingEnabled
                    onScroll={handleScroll}
                    snapToAlignment={"center"}
                    renderItem={({item, index})=>{
                        return(
                            <Pressable key = {index} onPress = {() =>navigation.navigate("post details", {CurrentUserProfilePic:route.params.profilePicture, username:route.params.username, item})}>
                                <View style={{
                                    flex:1,
                                    height: 170,
                                    width: 230,
                                    margin: 15,
                                    flexDirection: 'row',
                                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 1,
                                    shadowRadius: 4,
                                    elevation: 4,
                                    transform: [
                                        { scale: index === currentIndex ? 1.1 : 1 }
                                    ],
                                    marginLeft: index === 0 ? width/2-230/2 : 15,
                                    marginRight: index === filteredData.length - 1 ? width/2 - 230/2  : 15,
                                }}>
                                    <MapPostCard data = {item} username = {route.params.username} />
                                </View>
                            </Pressable>
                        )
                    }}/>
            </View>

        </View>

    )
}
