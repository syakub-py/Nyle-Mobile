import React, {useState, useEffect} from 'react';
import { View, Text, FlatList, Dimensions, Image, ScrollView} from 'react-native';
import axios from 'axios'
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-elements';

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
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order =market_cap_desc&per_page =20&page =1&sparkline =true&price_change_percentage =7d");
    const data = response.data;
    const formattedResponse = formatMarketData(data);
    return formattedResponse;
  } catch (error) {
    console.log(error.message);
    return []
  }
}

export default function Market({navigation, route}) {
  const [data, setData] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      const marketData = await getMarketData();
      setData(marketData);
    }

    const fetchCryptoNews = async () => {
      try {
        const response = await axios.get(
            'https://newsapi.org/v2/everything?q=crypto&sortBy=publishedAt&apiKey=0af11fce878b49a986b81ad1a90281b1'
        );
        setArticles(response.data.articles);
        console.log(articles)
      } catch (error) {
        console.log('Error fetching crypto news:', error);
      }
    };

    if (articles.length == 0) fetchCryptoNews();
    
    fetchMarketData();

  }, [])

  return (
    <FlatList
      data = {articles}
      keyExtractor = {(item) => item.url}
      ListHeaderComponent= {
        <View>
          <Image
            source = {require('../Screens/Components/icon.png')}
            style = {{ height: 75, width: 75, marginLeft: 20, marginTop: 20 }}
          />
          <View>
            <Text style = {{ fontSize: 24, fontWeight: 'bold' }}>Coin Prices</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator = {false}>
              {data.map((item, index) => (
                  <View
                      style = {{
                        height: 150,
                        width: 150,
                        margin: 10,
                        backgroundColor: 'whitesmoke',
                        borderRadius: 10,
                        paddingHorizontal: 5,
                        paddingTop: 3,
                        alignItems: 'center',
                      }}
                      key= {index}
                  >
                    <Avatar source = {{ uri: item.image }} size = {50} rounded />
                    <Text style = {{ fontSize: 17, fontWeight: 'bold', marginVertical: 7 }}>
                      {item.symbol.toUpperCase()}
                    </Text>
                    <Text style = {{ color: 'black', fontWeight: 'bold', fontSize: 15 }}>
                      ${item.current_price}
                    </Text>
                    <View style = {{ flexDirection: 'row', marginVertical: 7 }}>
                      {item.price_change_percentage_24h < 0 ? (
                          <Ionicons name ='arrow-down-outline' style = {{ color: 'red' }} size = {20} />
                      ) : (
                          <Ionicons name ='arrow-up-outline' style = {{ color: 'lightgreen' }} size = {20} />
                      )}
                      <Text
                          style = {
                            item.price_change_percentage_24h > 0
                              ? { color: 'lightgreen', marginLeft: 5 }
                              : { color: 'red', marginLeft: 5 }
                          }
                      >
                        % {Math.round(item.price_change_percentage_24h * 100) / 100}
                      </Text>
                    </View>
                  </View>
              ))}
            </ScrollView>
            <Text style = {{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>Latest News</Text>
          </View>
        </View>
      }
      renderItem= {({ item }) => (
          <View style = {{ marginBottom: 16 }}>
            <Image source = {{ uri: item.urlToImage }} style = {{ height: 200, width: width-30, margin:15, borderRadius:20 }} />
            <Text style = {{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, marginLeft:15 }}>{item.title}</Text>
            <Text style = {{ fontSize: 14, color: 'gray', marginBottom: 8, marginLeft:15}}>Author: {item.author}</Text>
          </View>

      )}
      ListFooterComponent= {
        <View style = {{height:80}}>
        </View>
      }
    />
  );
}
