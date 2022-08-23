import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import axios, { Axios } from 'axios'

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


// function getCoins(){
//   coins = axios.get("http://127.0.0.1:5000/getCoins")
//   return coins
// }


export default function Wallet({navigation}) {
  coins = [
    {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      image: 'https://logos-world.net/wp-content/uploads/2020/08/Bitcoin-Logo.png',
      currentPrice : '25,000'
    },
    {
      id: 2,
      name: 'Solana',
      symbol: 'SOL',
      image: 'https://logos-world.net/wp-content/uploads/2020/08/Bitcoin-Logo.png',
      currentPrice : '25,000'

    },
    {
      id: 3,
      name: 'Etherum',
      symbol: 'ETH',
      image: 'https://logos-world.net/wp-content/uploads/2020/08/Bitcoin-Logo.png',
      currentPrice : '25,000'
    },
    {
      id: 4,
      name: 'USD Coin',
      symbol: 'USDT',
      image: 'https://logos-world.net/wp-content/uploads/2020/08/Bitcoin-Logo.png',
      currentPrice : '25,000'
    },
  ]
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View>
          {renderwalletInfoSection()}
          <FlatList
          data = {coins}
          keyExtractor = {item => item.id}
          contentContainerStyle ={{
            marginTop:30,
            paddingHorizontal: 10
          }}
          ListHeaderComponent = {
            <View>
              <Text style ={{color: 'black', fontSize:16, fontWeight:'bold'}}>Top Holdings</Text>
            </View>
          }
          renderItem ={({item}) => {
            return(
              // get from coingecko api from python (ask sergey how to do it)
              <TouchableOpacity style ={{height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
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
                    <Text style = {{fontSize:18, fontWeight: 'bold', }}>{item.name}</Text>
                </View>

                <View>
                  <Text>$ {item.currentPrice}</Text>
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