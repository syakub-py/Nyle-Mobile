import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Dimensions, Image, Pressable, ScrollView, ImageBackground} from 'react-native';
import axios from 'axios'
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-elements';
import {firestore, firestoreLite} from './Components/Firebase'
import { LineChart } from 'react-native-chart-kit';

const {width} = Dimensions.get("window");

const formatSparkline = (numbers) => {
  const sevenDaysAgo = moment().subtract(7, 'days').unix();
  let formattedSparkline = numbers.map((item, index) => {
    return{
      x: sevenDaysAgo + (index + 1) * 3600,
      y: item,
    }
  })
  
  
  return formattedSparkline;
}

const formatMarketData = (data) => {
  let formattedData = [];

  data.forEach(item => {
    const formattedSparkline = formatSparkline(item.sparkline_in_7d.price)

    const formattedItem = {
      ...item,
      sparkline_in_7d: {
        price: formattedSparkline
      }
    }

    formattedData.push(formattedItem);
  });
  return formattedData;
}

export const getMarketData = async () => {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d");
    const data = response.data;
    const formattedResponse = formatMarketData(data);
    return formattedResponse;
  } catch (error) {
    console.log(error.message);
    return []
  }
}



export default function Wallet({navigation, route}) {
    const [data, setData] = React.useState([]);
    const [wallet, setWallet] = React.useState([]);

    const getWalletInfo = async ()=>{
      const results =[];
      const WalletInfoCollection = collection(firestoreLite, "Wallets/" + route.params.username);
      const WalletInfoSnapshot = await getDocs(WalletInfoCollection);
      WalletInfoSnapshot.forEach(doc => {
        results.push(doc.data())
      });
      return results;
    }
  
    React.useEffect(() => {
      const fetchMarketData = async () => {
        const marketData = await getMarketData();
        setData(marketData);
      }
      // getWalletInfo().then((result) =>{
      //   setWallet(result);
      // }).catch((error)=>{
      //   console.log(error)
      // })

      fetchMarketData();

    }, [])

    var walletValue = 96569;
    const chartConfig = {
      backgroundGradientFrom: '#1E2923',
      backgroundGradientTo: '#08130D',
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    };
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto"/>
        <View>
          <FlatList
          data = {data}
          keyExtractor = {item => item.id}
          contentContainerStyle ={{
            marginTop:20,
          }}
          ListHeaderComponent = {
            <View style={{width:width, margin:10}}>
              <Image source={require('../Screens/Components/icon.png')} style={{height:100, width:100, marginLeft:20}}/>
              <View style={{marginBottom:10, alignItems:'center'}}>
                <Text style={{fontWeight:'600', fontSize:50,}}>$968,495</Text>
                <View style={{backgroundColor:'lightgreen', borderRadius:20}}>
                  <View style={{flexDirection:'row',  margin:7}}>
                    <Text style={{fontSize:15, fontWeight:'bold', color:'black'}}><Ionicons name='arrow-up-outline' color={'black'} size={15}/>2.65%</Text>
                    <Text style={{marginLeft:3, marginRight:3, fontWeight:'bold', opacity:0.5}}>|</Text>
                    <Text style={{fontWeight:'bold'}}>$7,000</Text>
                  </View>
                </View>
              </View>

              <View style={{marginTop:20}}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {
                  data.map((item, index) =>(
                    <View style={{height:150, width:150, margin:10, backgroundColor:'white'}} key={index}>
                      <View style = {{paddingHorizontal:5, paddingTop:3, alignItems:'center'}}>
                        <Avatar source={{uri: item.image}} size={50} rounded/>
                        <Text style = {{fontSize:17, fontWeight: 'bold', margin:7}}>{item.symbol.toUpperCase()}</Text>
                        <Text style={{color:'black', fontWeight:'bold', fontSize:15}}>${item.current_price}</Text>
                        <View style={{flexDirection:'row', margin:7}}>
                            {item.price_change_percentage_24h<0?<Ionicons name='arrow-down-outline' style={{color:'red'}} size={20}/>:<Ionicons name='arrow-up-outline' style={{color:'lightgreen'}} size={20}/>}
                          <Text style={item.price_change_percentage_24h>0?{color:'lightgreen'}:{color:'red'}}>% {Math.round(item.price_change_percentage_24h*100)/100}</Text>
                        </View>  
                      </View>
                    </View>
                  ))
                  }
                </ScrollView>
              </View>

              <Text style={{fontSize:17, fontWeight:'bold'}}>Coin Balances</Text>
            </View>
          }
          renderItem ={({item}) => {
            //needs to refresh in the screen
            walletValue = walletValue+item.current_price*2;
            return(
              <Pressable style ={{margin: 7}}>
                <View style={{height: 55,  width:'100%',flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius:10}}>
                  <View style = {{width:35, margin:7}}>
                    <Image
                    source={{uri: item.image}}
                    style ={{
                      height:30,
                      width: 30,
                    }}
                    />
                  </View>
                  <View style = {{flex:1}}>
                      <Text style = {{fontSize:15, fontWeight: 'bold'}}>{item.name}</Text>
                  </View>
              
                  <View style={{margin:10}}>
                    <Text>Your Holdings: $ {item.current_price*2}</Text>
                    <Text style ={{fontSize:11, color: 'gray'}}>Current Value: $ {item.current_price}</Text>
                  </View>
                </View>
              </Pressable>
            )
          }}
          />
        </View>
      </SafeAreaView>
    );
}
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
  });