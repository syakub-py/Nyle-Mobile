import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet,SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import faker from 'faker';

faker.seed(10);
const chats =  [...Array(10).keys()].map((_, i) => {
  return {
      key: faker.random.uuid(),
      image: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
      name: faker.name.findName(),
      email: faker.internet.email(),
    };
});

export default function Chat({navigation}) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style= {{margin: 10, fontSize:18, fontWeight: 'bold'}}>Current converstions</Text>
          <FlatList
          data = {chats}
          keyExtractor = {item => item.key}
          
          contentContainerStyle = {{
            padding: 20
          }}

          renderItem = {({item, index}) => {
            return(
              //each card in the chat screen
              //add the onpress function here
              <TouchableOpacity>
                <View style = {{flexDirection: 'row', marginBottom:15}}>
                  <Image
                  source = {{uri: item.image}}
                  style = {{
                    width: 50, height:50, borderRadius:50,
                    marginRight: 10,
                  }}
                  />
                  <View>
                    <Text style ={{fontSize:18, fontWeight:'bold'}}>{item.name}</Text>
                    <Text style = {{fontSize:14, color:'grey', opacity:.7}}>{item.email}</Text>
                  </View>
                </View>
              </TouchableOpacity>
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