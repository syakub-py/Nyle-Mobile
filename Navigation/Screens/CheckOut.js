import { Text, StyleSheet, Image, View, Pressable,Dimensions, ScrollView } from 'react-native'
import React, { Component } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-elements';
import RNSwipeVerify from 'react-native-swipe-verify'
import axios from 'axios'
import { Dropdown } from 'react-native-element-dropdown';

const { width } = Dimensions.get('window')

export default function CheckOut({route, navigation}) {
    const [marketData, setMarketData] = useState([])
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const getMarketData = async () => {
        try {
          const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page =20&page =1&sparkline =true&price_change_percentage =7d");
          const data = response.data;
          return data;
        } catch (error) {
          console.log(error.message);
        }
    }

    useEffect(() => {
        getMarketData().then((response) => {
            setMarketData(response)
        })
    }, [])
    
    const data = [
        { label: 'Account used: 4563 (Coinbase)', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
        { label: 'Item 4', value: '4' },
        { label: 'Item 5', value: '5' },
        { label: 'Item 6', value: '6' },
        { label: 'Item 7', value: '7' },
        { label: 'Item 8', value: '8' },
      ];
    
    
    
    return (
      <View style = {{backgroundColor:'white', flex:1}}>
        <ScrollView>
            <View style = {{flexDirection:'row', justifyContent:'space-evenly'}}>
                <View style = {{position: 'absolute', top: 20, left: 20, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:70, opacity:0.8, alignItems:'center', justifyContent:'center'}}>
                    <Pressable onPress= {() =>navigation.goBack()}>
                        <Ionicons name ='arrow-back-outline' size = {30}/>
                    </Pressable>
                </View>
                <Text style = {{marginTop:30, fontSize:25, fontWeight:'bold', }}>{route.params.title}</Text>
            </View>
            <Text style = {{fontSize:18, fontWeight:'bold', margin:10}}>Purchase summary</Text>
            <View style = {{backgroundColor:'#ececec', height:400, margin:30, borderRadius:20}}>
                <View style = {{flexDirection:'row'}}>
                <Dropdown
                    style = {{height:50, width:width, borderColor: 'gray', borderWidth: 0, borderRadius: 30, paddingHorizontal: 8}}
                    placeholderStyle = {{}}
                    selectedTextStyle = {{}}
                    inputSearchStyle = {{}}
                    iconStyle = {{width: 20, height: 20,}}
                    data= {data}
                    search
                    maxHeight= {300}
                    labelField="label"
                    valueField="value"
                    placeholder= {!isFocus ? 'Select a wallet' : '...'}
                    searchPlaceholder="Search..."
                    value = {value}
                    onFocus= {() => setIsFocus(true)}
                    onBlur= {() => setIsFocus(false)}
                    onChange = {item => {
                        setValue(item.name);
                        setIsFocus(false);
                    }}
                    // renderLeftIcon= {(item) => (
                    //     <Avatar source = {{uri: item.image}} size = {30} rounded/>
                    // )}
                />
                </View>
                
                <ScrollView >
                    <Text style = {{ margin:10, fontSize:14, fontWeight:'bold' }}>Wallet balances</Text>
                  {
                    marketData.map((item, index) =>(
                        <View style = {{height:50, width:'100%', margin:10, flexDirection:'row', alignItems:'center' }} key= {index}>
                            <View style = {{paddingHorizontal:5, paddingTop:3, alignItems:'center', flexDirection:'row'}}>
                                <Avatar source = {{uri: item.image}} size = {30} rounded/>
                                <Text style = {{fontSize:17, fontWeight: 'bold', margin:7}}>{item.symbol.toUpperCase()}</Text>
                            </View>
                            <View>
                                <Text style = {{color:'black', fontWeight:'bold', fontSize:15, paddingLeft:150}}>${item.current_price}</Text>
                            </View>

                        </View>
                    ))
                  }
                </ScrollView>
            </View>
            <Text style = {{fontWeight:'bold', margin:10}}>Paying with</Text>
            <View style = {{height:50, backgroundColor:'#ececec', marginLeft:30, marginRight:30, marginBottom:15, borderRadius:20, justifyContent:'center'}}>
                <Dropdown
                    style = {{height:50, borderColor: 'gray', borderWidth: 0, borderRadius: 30, paddingHorizontal: 8,}}
                    placeholderStyle = {{}}
                    selectedTextStyle = {{}}
                    inputSearchStyle = {{}}
                    iconStyle = {{width: 20, height: 20,}}
                    data= {marketData}
                    search
                    maxHeight= {300}
                    labelField="name"
                    valueField="image"
                    placeholder= {!isFocus ? 'Select item' : '...'}
                    searchPlaceholder="Search..."
                    value = {value}
                    onFocus= {() => setIsFocus(true)}
                    onBlur= {() => setIsFocus(false)}
                    // renderLeftIcon= {({ image }) => {
                    //     return (
                    //     <Image source = {{ uri: image }} style = {{ width: 30, height: 30 }} />
                    //   )}}
                    onChange = {item => {
                        setValue(item.name);
                        setIsFocus(false);
                    }}
                     
                />
            </View>

            <RNSwipeVerify 
                width= {width - 100}
                buttonSize = {60}
                borderColor="#fff"
                borderRadius= {30}
                buttonColor="black"
                backgroundColor="#ececec"
                textColor = 'black'
                okButton= {{ visible: false, duration: 400 }}
                onVerified= {() => {
                    console.log("swiped")
                }}
                icon= {<Ionicons name ='chevron-forward-outline' size = {30} color= {'white'}/>}>
            <Text>Swipe to Confirm</Text>
          </RNSwipeVerify>

        </ScrollView>
      </View>
    )
}
