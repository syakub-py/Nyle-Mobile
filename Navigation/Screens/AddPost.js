import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    ScrollView,
    Image,
    Pressable,
    Dimensions,
    Alert,
    SafeAreaView,
    ActivityIndicator, Vibration
} from 'react-native';
import faker from 'faker';
import {firestore, getstorage} from './Components/Firebase';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from "lodash"
import DropdownInput from './Components/AddPostDropdown';
import { CheckBox } from 'react-native-elements';
import {CustomText, CustomTextInput, CustomTextWithInput} from './Components/CustomText';
import {getProfilePicture} from "./GlobalFunctions";
const {width} = Dimensions.get("window");
const height = width * 1;

/**

 *
 * @param {*} param0: {profilePicture: url of the profile, username: current username}
 * @returns
 */

const currencies = [
    { label: 'Bitcoin', value: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579" },
    { label: 'Ethereum', value: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880" },
    { label: 'Doge Coin', value: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256" },
    { label: 'USD', value: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389" },
    { label: 'Solana', value: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422" },
]

const upload = async (PhoneImagesArray, title, setAnimating) => {
    const UrlDownloads = [];
    setAnimating(true)
    try {
        for (const element of PhoneImagesArray) {
            const filename = element.split("/").pop();
            const response = await fetch(element);
            const blob = await response.blob();
            const storageRef = getstorage.ref().child(`images/${title}/${filename}`);
            await storageRef.put(blob);
            const url = await storageRef.getDownloadURL();
            UrlDownloads.push(url);
        }
        setAnimating(false)

        return UrlDownloads;
    } catch (error) {
        console.error(error);
        return [];
    }
};


const SelectImages = async (imageUrls, setImageUrls) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true
    });

    if (!result.canceled) {
        const currentImageUrls = [...imageUrls];
        const fileJson = result.assets;
        fileJson.forEach((element) => {
            currentImageUrls.push(element.uri)
        })
        setImageUrls(currentImageUrls);
    }
};

const onRefresh = (setRefreshing) => {
    setRefreshing(true);
    Vibration.vibrate(100)
    setTimeout(() => setRefreshing(false), 1000);
};


export default function AddPost({route}) {
    let randomNumber = Math.floor(Math.random() * 100);
    faker.seed(randomNumber);

    const [refresh, setRefreshing] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState('');
    const [details, setDetails] = useState('');
    const [price, setPrice] = useState(randomNumber.toString());
    const [coordinates, setCoordinates] = useState({latitude: 0, longitude: 0,});
    const [animating, setAnimating] = useState(false);
    const [category, setCategory] = useState("All");
    const [VIN, setVIN] = useState("");
    const [mileage, setMileage] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [SQFT, setSQFT] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [isFocus, setIsFocus] = useState(false);
    const [checked, setChecked] = useState(false);

    const categories = [{Label:"All", Value:"All"},{Label:"Tech", Value:"Tech"}, {Label:"Auto", Value:"Auto"}, {Label:"Homes", Value:"Homes"}, {Label:"Bikes", Value:"Bikes"}, {Label:"Bike Parts", Value:"Bike Parts"}, {Label:"Jewelry", Value:"Jewelry"},{Label:"Retail/Wholesale", Value:"Retail/Wholesale"}]

    //urls for the phone
    const [imageUrls, setImageUrls] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState({});
    const [currencyList, setCurrencyList] = useState([])
    const [profilePic, setProfilePic] = useState(null)

    useEffect(()=>{
        getProfilePicture(route.params.username).then((result)=>{
            setProfilePic(result)
        })
    },[])

    const dropMarker = (event) => {
        const coordinate = event.nativeEvent;
        setCoordinates({latitude: coordinate.coordinate.latitude, longitude: coordinate.coordinate.longitude});
    }

    const clear = () => {
        setTitle('');
        setDescription('');
        setDetails('');
        setPrice('');
        setCoordinates({latitude: 0, longitude: 0,});
        setVIN("")
        setMileage("")
        setImageUrls([]);
        setBathrooms("")
        setBedrooms("")
        onRefresh(setRefreshing);
    }

    const deleteImages = (index) => {
        const newArray = imageUrls
        newArray.splice(index, 1)
        setImageUrls(newArray)
        onRefresh(setRefreshing);
    }

    const createDocument = ({uniqueFields}, firebaseImageUrls) => ({
        id: randomNumber,
        title: title,
        PostedBy: route.params.username,
        currency: currencyList,
        description: description,
        pic: firebaseImageUrls,
        profilePic: profilePic,
        coordinates: coordinates,
        views: 0,
        likes: [],
        sold: "false",
        category: category,
        date: new Date().toLocaleString(),
        ...uniqueFields
    })

    const addPosts = async (collectionPath) => {
        if (!collectionPath) throw new Error('Error: collection name cannot be empty');

        const firebaseImageUrls = await upload(imageUrls,title,setAnimating)
        let uniqueFields = {};

        if (category === "Auto") {
            uniqueFields = {
                Vin: VIN,
                mileage: mileage,
                make: make,
                model: model
            }
        } else if (category === "Homes") {
            uniqueFields = {
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                SQFT: SQFT
            }
        } else {
            uniqueFields = {
                details: details
            }
        }

        const document = createDocument({uniqueFields}, firebaseImageUrls);

        return firestore.collection(collectionPath).doc(title).set(document)
            .then(ref => {
                Alert.alert("Post added")
                clear();
            })
            .catch(error => {
                console.log('Error adding document: ', error);
            });
    }

    const renderCurrencyItem = (item) => {
        return (
            <View style = {{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source = {{uri: item.value}} style = {{ width: 30, height: 30, margin:10, borderRadius:50 }} />
                <Text>{item.label}</Text>
            </View>
        );
    };

    const isImageUrls = () => {
        if (_.isEmpty(imageUrls)) {
            return (
                <Pressable onPress = {()=>SelectImages(imageUrls, setImageUrls)} style = {{justifyContent:'center', alignItems:'center'}}>
                    <View style = {{height:height, width:width, backgroundColor:'whitesmoke', justifyContent:'center', alignItems:'center'}}>
                        <Ionicons name ='images-outline' size = {80} color = {'lightgray'}/>
                    </View>
                </Pressable>
            )
        }

        return (
            <Pressable onPress = {()=>SelectImages(imageUrls, setImageUrls)} style = {{justifyContent:'center', alignItems:'center'}}>
                <View style = {{width:70, backgroundColor:'black', height:70, borderRadius:40, justifyContent:'center', alignItems:'center', marginTop:20}}>
                    <Ionicons name ='add-outline' size = {40} color = {'white'}/>
                </View>
            </Pressable>
        )
    }

    const renderDetailsText = () => {
        if ((category === "Homes" || category === "Auto"))  return  <View/>

        return (
            <View>
                <CustomTextWithInput
                    text="Details"
                    onChangeText={(text) => setDetails(text)}
                    multiline
                    height={200}
                />
            </View>
        )
    }

    const renderHomesSection = () => {
        if (category !== "Homes") return <View/>

        return (
            <View>
                <CustomTextWithInput text="Bedrooms" onChangeText={(text) => setBedrooms(text)} multiline />
                <CustomTextWithInput text="Bathrooms" onChangeText={(text) => setBathrooms(text)} multiline />
                <CustomTextWithInput text="Square footage" onChangeText={(text) => setSQFT(text)} multiline />
            </View>
        )
    }

    const renderAutoSection = () => {
        if (category !== "Auto") return <View/>

        return (
            <View>
                <CustomTextWithInput text="Make" onChangeText={(text) => setMake(text)} />
                <CustomTextWithInput text="Model" onChangeText={(text) => setModel(text)} />
                <CustomTextWithInput text="Mileage" onChangeText={(text) => setMileage(text)} />
                <CustomTextWithInput text="VIN" onChangeText={(text) => setVIN(text)} />
            </View>
        )
    }

    const isAnimating = () => {
        if (!animating) return <View/>
        return (
            <View>
                <ActivityIndicator size = "large" color = "black" animating = {animating} />
            </View>
        )
    }

    const renderPrice = () =>{
        if (checked){
            return(
                <View>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', margin: 10 }}>Price</Text>
                    <View style={{ margin: 10 }}>
                        <CheckBox
                            title="Accept multiple currencies"
                            checked={checked}
                            onPress={() => setChecked(!checked)}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 30 }}>
                        <DropdownInput
                            data={currencies}
                            labelField="label"
                            valueField="value"
                            placeholder="Select a currency"
                            onChange={(item) => {
                                setSelectedCurrency({...item, price: price});
                                const updatedCurrencyList = [...currencyList, selectedCurrency];
                                setCurrencyList(updatedCurrencyList)
                            }}
                            value={selectedCurrency}
                            renderItem={renderCurrencyItem}
                            customStyle={{
                                width: Dimensions.get('window').width / 3,
                            }}
                            setIsFocus={() => setIsFocus(false)}
                        />
                        <CustomTextInput onChangeText={(text) => setPrice(text)} width={Dimensions.get('window').width / 2.5} />
                    </View>

                    <View style={{zIndex:1, marginLeft:15,}}>
                        <Text>Currencies Accepted: </Text>
                        {
                            currencyList.map((item, index) => (
                                <View key={index} style={{flexDirection:'row', alignItems:'center',marginLeft:15,  marginBottom:5}}>
                                    <Image source={{uri:item.value}} style={{height:30, width:30, borderRadius:20}}/>
                                    <Text style={{marginLeft:5}}>{item.label}</Text>
                                    <Text style={{marginLeft:5}}>{item.price}</Text>
                                </View>
                            ))
                        }

                    </View>

                </View>
            )
        }else {
            return (
                <View>
                    <Text style = {{fontSize:25, fontWeight:'bold', color:'black',margin:10}}>Price</Text>
                    <View style={{margin:10}}>
                        <CheckBox
                            title="Accept muliple currencies"
                            checked={checked}
                            onPress={()=>setChecked(!checked)}
                        />
                    </View>
                    <View style = {{flexDirection:'row', marginLeft:30}}>

                        <DropdownInput
                            data={currencies}
                            labelField = "label"
                            valueField = "value"
                            placeholder = "Select a currency"
                            onChange={(item) => {
                                setSelectedCurrency({...item, price: price});
                                console.log(selectedCurrency)
                                setCurrencyList([selectedCurrency])

                            }}
                            value = {selectedCurrency}
                            renderItem = {renderCurrencyItem}
                            customStyle = {{
                                width: Dimensions.get('window').width / 3
                            }}
                            setIsFocus={()=>setIsFocus(false)}
                        />

                        <CustomTextInput onChangeText={(text) => setPrice(text)} width={width/2.5}/>
                    </View>
                </View>
            )
        }
    }

    return (
        <SafeAreaView style = {{backgroundColor:'white'}}>
            <ScrollView contentContainerStyle = {{paddingBottom:60}} refreshControl = {<RefreshControl refreshing = {refresh} onRefresh = {()=>onRefresh(setRefreshing)}/>} >
                <View>
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator = {false}>
                        {
                            imageUrls.map((item, index) =>(
                                <View key = {index}>
                                    <Image source = {{uri:item}} style = {{height:height, width:width}}/>
                                </View>
                            ) )
                        }
                    </ScrollView>

                    <ScrollView horizontal showsHorizontalScrollIndicator = {false} style = {{ bottom: 15, paddingHorizontal:5, position: 'absolute', width:width}}>
                        <View style = {{flexDirection:'row', alignItems:'center'}}>
                            {
                                imageUrls.map((i, k) =>(
                                    <Pressable key = {k}>
                                        <Pressable style = {{zIndex:1}} onPress = {() => {deleteImages(k)}}>
                                            <View style = {styles.shadowBox}>
                                                <View style = {styles.circle}>
                                                    <Ionicons name ='remove-outline' color = {'white'} size = {15} style = {{elevation:1}}/>
                                                </View>
                                            </View>
                                        </Pressable>
                                        <Image source = {{uri:i}} style = {{height:50, width:50, margin:10, borderRadius:10, alignContent:'center'}}/>
                                    </Pressable>
                                ))
                            }
                        </View>
                    </ScrollView>
                </View>


                {isImageUrls()}

                <View>
                    <CustomTextWithInput
                        text="Title"
                        onChangeText={(text) => setTitle(text)}
                        value={title}
                    />
                </View>

                <View>
                    <Text style = {{fontSize:25, fontWeight:'bold', color:'black',margin:10}}>Category</Text>
                    <DropdownInput
                        data={categories}
                        labelField = "Label"
                        valueField = "Value"
                        placeholder = "Select item"
                        onChange = {(item) => {
                            setCategory(item.Value);
                        }}
                        value = {category}
                        customStyle = {{
                            marginLeft:35,
                            marginRight:35
                        }}
                        setIsFocus={()=>setIsFocus(false)}
                    />

                </View>

                <View >
                    {renderPrice()}
                </View>

                <CustomText text="Location" />
                <View style = {{width:width-50, height:300, alignSelf:'center', marginBottom:20, borderRadius: 20, overflow: 'hidden'}}>
                    <MapView style = {{height:"100%", width:"100%"}} initialCamera = {{center: coordinates, pitch: 0,heading:0,zoom: 10, altitude:0}} onLongPress = {dropMarker}>
                        <Marker coordinate = {coordinates}/>
                    </MapView>
                </View>

                {renderDetailsText()}
                {renderHomesSection()}
                {renderAutoSection()}

                <View>
                    <CustomTextWithInput
                        text="Description"
                        onChangeText={(text) => setDescription(text)}
                        multiline={true}
                        height={200}
                        value={description}
                    />
                </View>

                {isAnimating()}

                <Pressable onPress = {() => {addPosts("AllPosts")}}>
                    <View style = {{marginBottom:20, marginLeft:10, marginRight:10, backgroundColor:"black", borderRadius: 20, alignItems:"center"}}>
                        <Text style = {{margin:10, color:"white", fontWeight:"bold"}}>Add post</Text>
                    </View>
                </Pressable>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textinput:{
        backgroundColor:'whitesmoke',
        marginLeft:35,
        marginRight:35,
        fontSize:15,
        height:50,
        borderRadius:10,
        paddingHorizontal:15,
    },
    shadowBox: {
        position: 'absolute',
        left: 5,
        top: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex:1
    },
    circle: {
        backgroundColor: 'red',
        height: 20,
        width: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});