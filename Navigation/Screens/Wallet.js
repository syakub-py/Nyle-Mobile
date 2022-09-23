import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, Pressable} from 'react-native';
import axios, { Axios } from 'axios'
import moment from 'moment';

function renderwalletInfoSection(walletValue){
  return(
    <View style ={{
      paddingHorizontal:10,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      elevation: 4,
      backgroundColor: 'white',
    }}>
      {/* balance Info */}
      <View style = {{margin:50}}>
        <Text style = {{color:'black'}}>Wallet Value</Text>

        <View style ={{
          flexDirection: 'row',
          alignItems: "flex-end"
        }}>
          <Text style = {{color: "black"}}>$</Text>
          <Text style ={{color: "black", marginLeft: 5, fontSize:18, fontWeight:'bold'}}>{walletValue}</Text>
          <Text style = {{color:'gray', fontSize: 12, marginLeft:5}}>USD</Text>
        </View>
      </View>
      <View style ={{
        flexDirection: 'row',
        alignItems: 'flex-end'
      }}>
      </View>
    </View>
  )
}

const formatSparkline = (numbers) => {
  const sevenDaysAgo = moment().subtract(7, 'days').unix();
  let formattedSparkline = numbers.map((item, index) => {
    return {
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
  }
}

export default function Wallet({navigation}) {
    const [data, setData] = React.useState([]);
    React.useEffect(() => {
      const fetchMarketData = async () => {
        const marketData = await getMarketData();
        setData(marketData);
      }
  
      fetchMarketData();
    }, [])

    var walletValue = 96569;
  
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View>
          {renderwalletInfoSection(walletValue)}
          <FlatList
          data = {data}
          keyExtractor = {item => item.id}
          contentContainerStyle ={{
            marginTop:30,
            paddingHorizontal: 15
          }}
          ListHeaderComponent = {
            <View>
              <Text style ={{color: 'black', fontSize:18, fontWeight:'bold'}}>Top Coins</Text>
            </View>
          }
          renderItem ={({item}) => {
            //needs to refresh in the screen
            walletValue = walletValue+item.current_price*2;
            return(
              <Pressable style ={{height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 10}}>
                <View style = {{width:35}}>
                  <Image
                  source={{uri: item.image}}
                  style ={{
                    height:30,
                    width: 30,
                  }}
                  />
                </View>
                <View style = {{flex:1}}>
                    <Text style = {{fontSize:18, fontWeight: 'bold'}}>{item.name}</Text>
                </View>

                <View>
                  <Text>Your Holdings: $ {item.current_price*2}</Text>
                  <Text style ={{fontSize:11, color: 'gray'}}>Current Value: $ {item.current_price}</Text>
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