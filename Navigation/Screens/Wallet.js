import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import axios, { Axios } from 'axios'
import moment from 'moment';

function renderwalletInfoSection(){
  const changePct = '2.3'
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
        <Text style = {{color:'black'}}>Your Wallet</Text>

        <View style ={{
          flexDirection: 'row',
          alignItems: "flex-end"
        }}>
          <Text style = {{color: "black"}}>$</Text>
          <Text style ={{color: "black", marginLeft: 10, fontSize:20, fontWeight:'bold'}}>45,000</Text>
          <Text style = {{color:'black', fontSize: 14, marginLeft:5}}>USD</Text>
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

const formatSparkLine = (numbers) =>{
  try{
    const sevenDaysAgo = moment().subtract(7, 'days').unix();
    let formatSparkLine = numbers.map((item, index)=>{
      return {
        x: sevenDaysAgo+(index+1)*3600,
        y: item,
      }
    })
    return formatSparkLine;
  }catch(error){
    console.log(error.message + "formatSparkLine()");
  }
}

const formatMarketData = (data) =>{
  let formattedData= [];
  try{
    data.forEach(item =>{
      const formatSparkline =  formatSparkLine(item.sparkline_in_7d.price)
      const formattedItem = {
        ...item,
        sparkline_in_7d:{
          price: formatSparkline,
        }
      }
      formattedData.push(formattedItem);
    })
  return formattedData;
  }catch(error){
    console.log(error.message + "formatMarketData()");
  }
}


export const getMarketData = async () =>{
  try{
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d")
    const data = response.data;
    const formatedResponse =formatMarketData(data);
    return formatedResponse;
  }catch(error){
    console.log(error.message);
  }
}

export default function Wallet({navigation}) {
  const [data, setData] = React.useState([])
  React.useEffect(() =>{
    const fetchMarketData = () =>{
      const marketData = getMarketData();
      setData(marketData);
    }
    fetchMarketData();
  }, [])
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View>
          {renderwalletInfoSection()}
          <FlatList
          data = {data}
          keyExtractor = {item => item.id}
          contentContainerStyle ={{
            marginTop:30,
            paddingHorizontal: 15
          }}
          ListHeaderComponent = {
            <View>
              <Text style ={{color: 'black', fontSize:16, fontWeight:'bold'}}>Top Holdings</Text>
            </View>
          }
          renderItem ={({item}) => {
            return(
              // get from coingecko api from python (ask sergey how to do it)
              <TouchableOpacity style ={{height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 10}}>
                <View style = {{width:35}}>
                  <Image
                  source={{uri: item.symbol}}
                  style ={{
                    height:30,
                    width: 30,
                  }}
                  />
                </View>
                <View style = {{flex:1}}>
                    <Text style = {{fontSize:18, fontWeight: 'bold', }}>{item.name}</Text>
                </View>

                <View>
                  <Text>$ {item.current_price}</Text>
                </View>
              </TouchableOpacity>
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