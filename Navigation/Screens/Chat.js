import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet,SafeAreaView, FlatList, Image, TouchableOpacity, Pressable, TextInput } from 'react-native';
import faker from 'faker';
import Ionicons from 'react-native-vector-icons/Ionicons';
faker.seed(10);
const chats =  [...Array(50).keys()].map((_, i) => {
  return {
      key: faker.random.uuid(),
      image: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
      name: faker.name.findName(),
      email: faker.internet.email(),
      lastText:faker.lorem.lines(1)
    };
});



export default function Chat({navigation}) {
  const [filteredData, setfilterData] = React.useState([]);
  const [masterData, setMasterData] = React.useState([]);
  const[search, setSearch] = React.useState([])
  
  React.useEffect(()=>{
    setfilterData(chats);
    setMasterData(chats);
  }, [])


  const searchFilter = (text) =>{
    if (text){
      const newData = masterData.filter((item) =>{
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase()
        const textData = text.toUpperCase();
        return itemData.indexOf(textData)>-1;
      });
      setfilterData(newData);
      setSearch(text);
    }else{
      setfilterData(masterData);
      setSearch(text);
    }
  }
  const ItemSeparator = () => {
    return(
      <View style ={{height:1, backgroundColor:'lightgray', width:'100%', marginBottom:5}}/>
    )
  }
    return (
      <SafeAreaView style={styles.container}>
        
          <FlatList
          data = {filteredData}
          keyExtractor = {item => item.key}
          
          contentContainerStyle = {{
            padding: 20,

          }}
          ListHeaderComponent = {
            <View>
              <TextInput placeholder='Search Chat...' value={search} onChangeText={(text) => searchFilter(text)} style={{marginTop:20, marginBottom:20,elevation:3, height:60, paddingHorizontal:15, borderRadius:20, backgroundColor:'white'}}/>
              <Text style= {{marginBottom:20, fontSize:18, fontWeight: 'bold'}}>Current converstions</Text>
            </View>
        }
          ItemSeparatorComponent = {ItemSeparator}
          renderItem = {({item, index}) => {
            return(
              <Pressable onPress={() => {navigation.navigate("chat box")}}>
                <View style = {{flexDirection: 'row', marginBottom:15}}>
                  <Image
                  source = {{uri: item.image}}
                  style = {{
                    width: 50, height:50, borderRadius:50,
                    marginRight: 10,
                  }}
                  />
                  <View>
                    <Text style ={{fontSize:18, fontWeight:'bold'}}>{item.name} </Text>
                    <Text style ={{fontSize:15, color:'grey'}}>{item.email}</Text>
                    <Text style = {{fontSize:14, color:'lightgrey'}}>{item.lastText}</Text>
                  </View>
                </View>
              </Pressable>
            )
          }}
          />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },

    separator: {
      height: 1,
      width: '100%',
      color:'black'
    }
  });