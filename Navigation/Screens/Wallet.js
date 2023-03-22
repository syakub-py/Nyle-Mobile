import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Dimensions, Image, Pressable, ScrollView, ImageBackground} from 'react-native';
import axios from 'axios'
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import faker from 'faker';
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
  }
}

const transactions =[
  {
    title: faker.address.streetAddress(),
    price: "560",
    currency: "https://www.pngall.com/wp-content/uploads/10/Solana-Crypto-Logo-PNG-File.png",
    location: faker.address.state(),
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
    description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
    pic: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=300',
    profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
  },
  {
    title: faker.address.streetAddress(),
    price: "50",
    currency: "https://logos-world.net/wp-content/uploads/2020/08/Bitcoin-Logo.png",
    location:faker.address.state(),
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
    description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
    pic: 'https://images.pexels.com/photos/8134820/pexels-photo-8134820.jpeg?auto=compress&cs=tinysrgb&w=300',
    profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
  },
  {
    title: faker.address.streetAddress(),
    price: "50",
    currency: "https://w7.pngwing.com/pngs/368/176/png-transparent-ethereum-cryptocurrency-blockchain-bitcoin-logo-bitcoin-angle-triangle-logo-thumbnail.png",
    location: faker.address.state(),
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
    description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
    pic: 'https://images.pexels.com/photos/7598365/pexels-photo-7598365.jpeg?auto=compress&cs=tinysrgb&w=300',
    profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
  },
  {
    title: faker.address.streetAddress(),
    price: "10",
    currency: "https://seeklogo.com/images/D/dogecoin-doge-logo-625F9D262A-seeklogo.com.png?v=637919377460000000",
    location: faker.address.state(),
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
    description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
    pic: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=300',
    profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
},
]

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
                <Text style ={{color: 'black', fontSize:18, fontWeight:'bold'}}>Recent Transactions</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {
                    transactions.map((item, index) =>(
                      <View style={{height:150, width:150, margin:10, shadowColor:'black',elevation:3}} key={index}>
                        <ImageBackground source={{uri:item.pic}}  imageStyle={{height:150, width:"100%",borderRadius:20}} resizeMode={'cover'}>
                          <View style={{flexDirection:'row', paddingHorizontal:5, paddingTop:3}}>
                            <Avatar source={{uri: item.profilePic}} rounded/>
                            <Text style={{color:'white', fontWeight:'bold', paddingHorizontal:10, paddingTop:5}}>{item.title}</Text>
                          </View>
                          <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:10}}>
                            <Image style={{height:15, width:15, marginRight:3, marginLeft:3}} source={{uri:item.currency}}/>
                            <Text style={{color:'white',}}>{item.price}</Text>
                          </View>
                        </ImageBackground>
                      </View>
                    ))
                  }
                </ScrollView>
                <Text style ={{color: 'black', fontSize:18, fontWeight:'bold'}}>Top Coins</Text>
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