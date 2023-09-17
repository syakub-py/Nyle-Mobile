import {
    Alert,
    Dimensions, FlatList,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useState, useRef, useEffect} from 'react';
import MapView, {Circle, Marker} from 'react-native-maps';
import {firestore} from './Components/Firebase'
import {generateRating, handleLike, isLiked,updatedCurrencyList} from "./GlobalFunctions";
import CustomMapMarker from "./Components/CustomMapMarker";
import _ from "lodash";
import MenuButton from "./Components/MenuButtons";
import BackButton from "./Components/BackButton";
const {width} = Dimensions.get("window");
const height = width * 1;

/*
    @route.params = {Currency:url of the currency, CurrentUserProfilePic:current users profile picture, DatePosted:the date the post was posted, Description: description of the post, details: minor details of post, Likes: array of usernames that liked the post, PostTitle:the title of the post, images:array of urls of the images of the post, postedBy:the user that made the post, username:the current username, views: number of views}
*/

const handleAddChat = (params, navigation) => {
    if (params.username !== params.item.PostedBy) {
        firestore
            .collection('Chats')
            .add({
                owners: [
                    {
                        profilePic: params.CurrentUserProfilePic,
                        username: params.username,
                    },
                    {
                        profilePic: params.item.profilePic,
                        username: params.item.PostedBy,
                    },
                ],
            })
            .then((ref) => {
               const owners =   [
                    {
                        profilePic: params.CurrentUserProfilePic,
                        username: params.username,
                    },
                    {
                        profilePic: params.item.profilePic,
                        username: params.item.PostedBy,
                    },
                ]

                const username = owners[1].username
                navigation.navigate("chat box", {username: params.username, conversationID:ref.id, name: username, avatar: owners[1].profilePic, otherAvatar:owners[0].profilePic, userId:findUser(owners, params.username)})
            })
            .catch((error) => {
                Alert.alert('Error adding document: ', error);
            });
    }
};

const toggleDropdown = (isOpen, setIsOpen) => {
    setIsOpen(!isOpen);
};

const handleViewCounter = (setViews, item) => {
    const PostRef = firestore.collection('AllPosts').doc(item.title);
    PostRef.get()
        .then((doc) => {
            const currentViews = doc.data().views;
            setViews(currentViews + 1);
            PostRef.update({ views: currentViews + 1 })
                .then(() => {
                })
                .catch((error) => {
                    console.error('Error adding value to views:', error);
                });
        });
};

const findUser = (userArray, username) => {
    for (let index = 0; index < userArray.length; index++) {
        if (userArray[index].username !== username) return index
    }
    return "";
}

const getRealEstateData = async (address, setRealEstateData) => {
    try {
        const response = await fetch(`http://192.168.255.115:5000/api/getOwner/?address=${address.toUpperCase()}`);
        setRealEstateData(response.json())
    } catch (error) {
        console.log("server offline");
    }
};


export default function PostDetails({route, navigation}) {
    const images = route.params.item.pic
    const likes = route.params.item.likes
    const username =route.params.username
    const [state, setState] = useState({active:0})
    const [more, setMore] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [views, setViews] = useState(0)
    const [currentOffset, setCurrentOffset] = useState(0);
    const scrollViewRef = useRef(null);
    const [rating, setRating] = useState(0)
    const [numOfReviews, setNumOfReviews] = useState(0)
    const [realEstateData, setRealEstateData] = useState([])
    const [Liked, setLiked] = useState(isLiked(likes, username))

    useEffect(() => {
        handleViewCounter(setViews, route.params.item);
        generateRating(route.params.item.PostedBy, setRating, setNumOfReviews)
        if (route.params.item.category === "Homes") {
            //"79-33 213 street"
            getRealEstateData(route.params.item.title, setRealEstateData)
        }
    }, [])

    const change = ({ nativeEvent }) => {
        const slide = Math.floor(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        const newOffset = nativeEvent.contentOffset.x;
        setCurrentOffset(newOffset);
        setState({ active: slide });
        if (slide <= images.length-4) {
            scrollViewRef.current.scrollTo({
                x: 0,
                animated: true,
            });
        }
    
        if (slide >= 6) {
            setCurrentOffset(currentOffset + 10);
            scrollViewRef.current.scrollTo({
                x: currentOffset,
                animated: true,
            });
        }
    }

    const renderIsLiked = () => {
        if (Liked) return <Ionicons name ='heart' size = {30} color = {'#e6121d'}/>
        return <Ionicons name ='heart-outline' size = {30}/>
    }

    const renderIsCategoryHomes = (item) => {
        if (item.category === "Homes") {
            return (
                <View style = {{flexDirection:"row", alignContent:'center', marginTop:5}}>
                    <View style = {{flexDirection:"row", alignContent:'center'}}>
                        <Ionicons name = {'bed'} color = {'black'} size = {20}/>
                        <Text style = {{fontSize:15, color:'black', marginRight:10, marginLeft:5}}>{item.bedrooms}</Text>
                    </View>

                    <View style = {{flexDirection:"row", alignContent:'center'}}>
                        <Ionicons name = {'water'} color = {'black'} size = {20}/>
                        <Text style = {{fontSize:15, color:'black', marginRight:10}}>{item.bathrooms}</Text>
                    </View>
                    <View style = {{flexDirection:"row", alignContent:'center'}}>
                        <Ionicons name = {'expand'} color = {'black'} size = {20}/>
                        <Text style = {{fontSize:15, color:'black', marginRight:10, marginLeft:5}}>{item.SQFT}</Text>
                    </View>

                </View>
            )
        }
    }

    const renderIsCategoryAuto = (item) => {
        if (item.category === "Auto") {
            return (
                <View style = {{flexDirection:"column"}}>
                    <View style = {{ flexDirection:"row", alignContent:'center', marginTop:5 }}>

                        <View style = {{flexDirection:"row", alignContent:'center'}}>
                            <Ionicons name = {'car-outline'} color = {'black'} size = {20}/>
                            <Text style = {{fontSize:15, color:'black', marginRight:10, marginLeft:5}}>{item.mileage}</Text>
                        </View>

                        <View style = {{flexDirection:"row", alignContent:'center'}}>
                            <Ionicons name = {'information-circle-outline'} color = {'black'} size = {20}/>
                            <Text style = {{fontSize:15, color:'black', marginRight:10, marginLeft:5}}>{item.Vin}</Text>
                        </View>

                    </View>
                    <View style = {{ flexDirection:"row", alignContent:'center', marginTop:5 }}>

                        <View style = {{flexDirection:"row", alignContent:'center'}}>
                            <Ionicons name = {'hammer-outline'} color = {'black'} size = {20}/>
                            <Text style = {{fontSize:15, color:'black', marginRight:10, marginLeft:5}}>{item.make}</Text>
                        </View>

                        <View style = {{flexDirection:"row", alignContent:'center'}}>
                            <Ionicons name = {'information-circle-outline'} color = {'black'} size = {20}/>
                            <Text style = {{fontSize:15, color:'black', marginRight:10, marginLeft:5}}>{item.model}</Text>
                        </View>

                    </View>
                </View>
            )
        }
    }

    const isPostedBySameAsUsername = (item, username) => {
        if (item.PostedBy !== username) {
            return (
                <View style = {{flexDirection:"row", justifyContent:'space-between'}}>
                    <View style = {{justifyContent:'center', flexDirection:'row',  marginLeft:10}}>
                        <Image source = {{uri:item.profilePic}} style = {{height:60, width:60, borderRadius:10, alignSelf:'center'}}/>
                        <View style = {{margin:10,alignSelf:'center'}}>
                            <Text style = {{fontWeight:'bold', color:'black', }}>{item.PostedBy}</Text>
                            <Text style = {{fontWeight:'bold', color:'lightgrey'}}>Owner</Text>
                            <Pressable onPress = {() => {navigation.navigate("Reviews", {username: item.PostedBy , currentUser: username})}}>
                                <View style = {{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                    marginTop: 2
                                }}>
                                    <Ionicons name = "star" style = {{ marginRight: 3 }} color = "#ebd61e" size = {13} />
                                    <Text style = {{ fontSize: 12, fontWeight: 'bold' }}>{rating.toFixed(1)}</Text>
                                    <Text style = {{ fontSize: 10, color:'grey', marginLeft:3}}>({numOfReviews} reviews)</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>

                    <Pressable onPress = {()=>handleAddChat(route.params, navigation)}>
                        <View style = {{height:60, width:60, borderRadius:15, backgroundColor:'#292929', elevation:10, margin:10}}>
                            <Ionicons name = "chatbox-ellipses-outline" color = {'white'} size = {30} style = {{margin:15}}/>
                        </View>
                    </Pressable>
                </View>  
            )
        }

        return (
            <View style = {{flexDirection:"row", justifyContent:'space-between'}}>
                <View style = {{justifyContent:'center', flexDirection:'row', margin:10}}>
                    <Image source = {{uri:route.params.item.profilePic}} style = {{height:60, width:60, borderRadius:10, alignSelf:'center'}}/>
                    <View style = {{margin:10,alignSelf:'center'}}>
                        <Text style = {{fontWeight:'bold', color:'black', }}>{item.PostedBy} (You)</Text>
                        <Text style = {{fontWeight:'bold', color:'lightgrey'}}>Owner</Text>
                        <View style = {{flexDirection:'row', alignItems:'center', marginTop:3}}>
                            <Ionicons name = {'star'} style = {{marginRight:3}} color = {"#ebd61e"} size = {13}/>
                            <Text style = {{fontSize:12, fontWeight:'bold'}}>{rating.toFixed(1)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const renderHomesAndAuto = (item) => {
        if (!(item.category !== "Homes" && item.category !== "Auto")) return  <View></View>

        return (
            <View>
                <Text style = {{marginRight:30, marginLeft:30, color:'#a8a5a5', fontSize:15}}>{item.details}</Text>
            </View>
        )
    }

    const isRealEstateData = (item, realEstateData) => {
        if(realEstateData &&  realEstateData.length === 0 && item.category === "Homes") {
            return (
                <View style = {{ marginLeft: 30 }}>
                    <Text style = {{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>Public Records for {route.params.item.title}</Text>
                    <Text style = {{ fontSize: 15, color: 'lightgrey', marginTop: 5, marginBottom: 5 }}>Beta only works in New York City</Text>
                    <Text style = {{ fontSize: 15, color: 'lightgrey', marginTop: 10 }}>Nothing to show here</Text>
                </View> 
            )
        }
    }

    const renderHomesSection = (item, realEstateData) => {
        if (!(item.category === "Homes" && realEstateData.length > 0 && realEstateData)) return <View></View>
        return (
            <View>
                <View style = {{ marginLeft: 25 }}>
                    <Text style = {{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>Public Records for {route.params.item.title}</Text>
                    <Text style = {{ fontSize: 15, color: 'lightgrey', marginTop: 5, marginBottom: 5 }}>Beta only works in New York City</Text>
                    <ScrollView>
                        {
                            realEstateData.map((record, index) => (
                                <View key = {index} style = {{ flexDirection: "row", margin: 5 }}>
                                    <Text>{record.NAME}</Text>
                                </View>
                            ))
                        }
                    </ScrollView>
                </View>
            </View>
        )
    }

    const renderDescription = (description) =>{
        if (!_.isEmpty(description)){
            return(
                <View style = {{marginBottom:20}}>
                    <Text style = {{marginRight:30, marginLeft:30, color:'black', fontSize:15}} onPress = {() =>setMore(true)}>{(more &&  !_.isEmpty( description)) ?  description :  description.slice(0, 500) + " ..."}</Text>
                </View>
            )
        }else{
            return (
                <View/>
            )
        }
    }

    const renderArrangePickup = (item, username, profilePic) => {
        if (item.PostedBy !== username){
            return(
                <Pressable onPress={()=>{navigation.navigate("Transaction Calendar", {item:item ,currentUsername:username, currentProfilePic:profilePic})}} style = {{flexDirection:'row', position: 'absolute', bottom: 0, height:70, width:width-50, justifyContent:'space-evenly', backgroundColor:'black', alignItems:'center', marginLeft:25, marginRight:25, marginBottom:10, borderRadius:10}}>
                    <Ionicons name={"calendar-outline"} size={20} color={"white"}/>
                    <Text style = {{color:'white', fontSize:15, fontWeight:"bold"}}>Arrange a pickup</Text>
                </Pressable>
            )
        }else{
            return(
                <View/>
            )
        }
    }



    return (
        <SafeAreaView style = {{flex:1}}>
            <ScrollView style = {{backgroundColor:'white'}} showsVerticalScrollIndicator = {false}>
                <View style = {{zIndex:1}}>
                    <View style = {{position: 'absolute', top: 30, left: 15, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:13, opacity:0.7, alignItems:'center', justifyContent:'center'}}>
                        <BackButton navigation={navigation}/>
                    </View>

                    <View style = {{position: 'absolute', top: 30, right: 15, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:13, opacity:0.7, alignItems:'center', justifyContent:'center'}}>
                        <Pressable onPress = {() => setIsOpen(!isOpen)}>
                            <Ionicons name ='reorder-three-outline' size = {30}/>
                        </Pressable>
                    </View>

                    <Modal
                        visible={isOpen}
                        animationType="slide"
                        onRequestClose={() => toggleDropdown(isOpen, setIsOpen)}
                        transparent={true}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{ width: 280, height: 250, backgroundColor: '#fff', borderRadius: 20, flexDirection:'column', justifyContent: 'space-between' }}>
                                <View style={{flexDirection:"row"}}>
                                    <MenuButton title={'Share'} onPress={() => {}} iconName={'share-social-outline'} style={{ backgroundColor: 'whitesmoke', width: 120, height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center',margin:10}} />
                                    <MenuButton title={'Report'} onPress={() => {}} iconName={'alert-outline'} style={{ backgroundColor: 'whitesmoke', width: 120, height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center', margin:10}} />
                                </View>
                                <View style={{flexDirection:"row"}}>
                                    <MenuButton title={'Share'} onPress={() => {}} iconName={'share-social-outline'} style={{ backgroundColor: 'whitesmoke', width: 120, height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center',margin:10}} />
                                    <MenuButton title={'Report'} onPress={() => {}} iconName={'alert-outline'} style={{ backgroundColor: 'whitesmoke', width: 120, height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center', margin:10}} />
                                </View>
                            </View>
                        </View>
                    </Modal>


                    <View style = {{position: 'absolute', top: 30, right: 75, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:13, opacity:0.7, alignItems:'center', justifyContent:'center'}}>
                        <Pressable onPress = {() =>handleLike(route.params.item.title, username, Liked, setLiked)}>
                            {renderIsLiked()}
                        </Pressable>
                    </View>

                </View>

                <View>

                    <View style = {{ maxWidth: 60,zIndex: 1, bottom: 10, right: 10, paddingHorizontal:5, position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 4, alignItems:'center'}}>
                        <Text style = {{ color: 'white', fontWeight: 'bold' }}>{state.active + 1}/{images.length}</Text>
                    </View>

                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator = {false} onScroll = {change}>
                        {
                            images.map((image, key) => (
                                <Pressable onPress = {() => {navigation.navigate("Photo Collage", {pictures:images, index: key, title:route.params.item.title})}} key = {key}>
                                    <View style = {{width, height, position: 'relative'}} >
                                        <Image style = {{width, height}} resizeMode = {'cover'} source = {{uri:image}} key = {key}/>
                                    </View>
                                </Pressable>
                                )
                            )
                        }
                    </ScrollView>

                    <ScrollView horizontal showsHorizontalScrollIndicator = {false} style = {{ bottom: 25, paddingHorizontal:5, position: 'absolute', width:width}}  ref = {scrollViewRef}>
                        <View style = {{flexDirection:'row', alignItems:'center'}}>
                            {
                                images.map((i, k) =>(
                                    <Pressable key = {k} onPress = {() => {console.log(k+1)}}>
                                        <Image source = {{uri:i}} style = {k == state.active?{height:60, width:60, margin:7, borderRadius:10}:{height:50, width:50, margin:7, borderRadius:10, alignContent:'center'}} key = {k}/>
                                    </Pressable>
                                ))
                            }
                        </View>
                    </ScrollView>

                    <View style = {{flexDirection:'row', position: 'absolute',bottom: 3, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 4, alignItems:'center', marginBottom:5, marginLeft:5, paddingHorizontal:3}}>
                        <View style = {{
                            flexDirection: 'row',
                            backgroundColor: 'transparent',
                            borderRadius: 5,
                            alignItems:'center'
                        }}>
                            <Ionicons name ='heart' size = {20} color = {'#e6121d'}/>
                            <Text style = {{
                                color: 'white',
                                fontSize: 12,
                                fontWeight: 'bold',
                                marginLeft: 3,
                                marginRight: 5,

                            }}>{route.params.item.likes.length}</Text>
                        </View>
                        <View style = {{  flexDirection: 'row',
                            backgroundColor: 'transparent',
                            borderRadius: 5,
                            alignItems:'center'}}>
                            <Ionicons name ='eye' size = {20} color = {'white'}/>
                            <Text style = {{  color: 'white',
                                fontSize: 12,
                                fontWeight: 'bold',
                                marginLeft: 3,}}>{route.params.item.views}</Text>
                        </View>
                    </View>

                </View>

                <View style = {{marginLeft:10, marginTop:10}}>
                    <View style = {{ backgroundColor:'transparent'}}>
                        <Text style = {{color:'black',fontSize:23,fontWeight:'bold'}}>{route.params.item.title}</Text>
                    </View>

                    <View style={{width:60}}>
                        <FlatList horizontal
                                  data={updatedCurrencyList(route.params.item.currency)}
                                  snapToAlignment={"center"}
                                  pagingEnabled
                                  showsHorizontalScrollIndicator={false}
                                  renderItem={({item})=>(
                                      <View style = {{ width:60,backgroundColor:'transparent', borderRadius: 4, alignItems:'center', flexDirection:"row", marginTop:5}}>
                                          <Image style = {{height:20, width:20, marginRight:7, borderRadius:20}} resizeMode = {'cover'} source = {{uri:item.value}}/>
                                          <Text style = {{fontSize:20, fontWeight:'bold', color:'black', marginRight:10}}>{item.price}</Text>
                                      </View>
                                  )}
                        />
                    </View>

                    <Text style = {{fontSize:12, fontWeight:'bold', color:'black'}}>(${route.params.item.USD})</Text>

                    {renderIsCategoryHomes(route.params.item)}
                    {renderIsCategoryAuto(route.params.item)}

                </View>
                {isPostedBySameAsUsername(route.params.item, username)}

                {renderDescription(route.params.item.description)}

                    <Pressable onLongPress = {() => {navigation.navigate("Map", {coordinates:route.params.item.coordinates, firstImage:images[0]})}}>
                        <View style = {{width:width-50, height:300, alignSelf:'center', marginBottom:20, borderRadius: 20, overflow: 'hidden', elevation:3}}>
                            <MapView style = {{height:"100%", width:"100%"}} initialCamera = {{center: route.params.item.coordinates, pitch: 0,heading:0,zoom: 12, altitude:0}} >
                                <Marker coordinate = {route.params.item.coordinates}>
                                   <CustomMapMarker firstImage = {images[0]}/>
                                </Marker>
                                <Circle
                                    center = {route.params.item.coordinates}
                                    radius = {1200}
                                    fillColor = "rgba(66, 135, 245, 0.2)"
                                    strokeColor = "rgba(66, 135, 245, 0.7)"
                                    strokeWidth = {1}
                                />
                            </MapView>
                        </View>
                    </Pressable>


                {renderHomesAndAuto(route.params.item)}

                {isRealEstateData(route.params.item, realEstateData)}

                {renderHomesSection(route.params.item, realEstateData)}

                <Text style = {{color:'#a8a5a5', margin:10,fontSize:17, fontWeight:'semi-bold', alignSelf:'center'}}>{route.params.date}</Text>

            </ScrollView>

            {renderArrangePickup(route.params.item, username, route.params.CurrentUserProfilePic)}





            {/*<View style = {{flexDirection:'row', position: 'absolute', bottom: 0, height:'10%', width:'100%', justifyContent:'space-evenly', backgroundColor:'transparent', alignItems:'center'}}>*/}
            {/*    <View style = {{justifyContent:"center", backgroundColor:"black", borderRadius:200, width:150, height:50, alignItems:'center'}}>*/}
            {/*        <Pressable>*/}
            {/*            <Text style = {{color:'white', fontSize:15, fontWeight:"bold"}}>Place Bid</Text>*/}
            {/*        </Pressable>*/}
            {/*    </View>*/}

            {/*    <View style = {{justifyContent:"center", backgroundColor:"black", borderRadius:200, width:150, height:50, alignItems:'center'}}>*/}
            {/*        <Pressable onPress = {() => navigation.navigate("Check Out", {title: route.params.PostTitle, price:route.params.Price, currency: route.params.Currency})}>*/}
            {/*            <Text style = {{color:'white', fontSize:15, fontWeight:"bold"}}>Buy out</Text>*/}
            {/*        </Pressable>*/}
            {/*    </View>*/}
            {/*</View>*/}
        </SafeAreaView>
    )
}
