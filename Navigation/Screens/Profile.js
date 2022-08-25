import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet,SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import faker from 'faker'


const SectionTitle = ({title}) => {
  return(
    <View style = {{marginTop: 20}}>
      <Text style={{color: 'lightgray'}}>{title}</Text>
    </View>)}

const Setting = ({title, value, type, onPress}) => {
  if (type == "button"){
    return(
      <TouchableOpacity style = {{flexDirection: 'row', height:50, alignItems:'center'}} onPress = {onPress}>
        <Text style = {{flex:1, color:'black', fontSize: 14}}>{title}</Text>

        <View style = {{flexDirection:'row', alignItems:'center'}}>
          <Text style = {{marginRight:10, color: 'lightgray', fontSize:14}}>{value}</Text>
        </View>
      </TouchableOpacity>
    )
  }else{
    return(
      <View></View>
    )
  }
}

export default function Profile({navigation}) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator = {false} style ={{margin:15}}>
          {/* container for user image */}
          <View style = {{alignSelf:"center"}}>
            <View>
              <Image source = {{uri:`https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,}} style = {styles.image} resizeMode ="center"/>
            </View>
          </View>

          {/* name */}
          <Text style = {styles.username}>{faker.name.findName()}</Text>
          {/* rest of settings screen */}
          <View style = {{flexDirection: 'row',marginTop: 23 }}>
            <View style ={{flex:1,}}>
              <Text style ={{color:'black'}}>{faker.internet.email()}</Text>
            </View>
          </View>

          <SectionTitle
          title = 'Account'
          />

          <Setting
          title = "Change password"
          value = "Home"
          type = "button"
          onPress = {() => console.log("pressed button")}
          />

        <Setting
          title = "Apperence"
          value = "Light"
          type = "button"
          onPress = {() => console.log("pressed button")}
          />

      <Setting
          title = "Connect a wallet"
          value = "Not connected"
          type = "button"
          onPress = {() => console.log("pressed button")}
          />
      <Setting
        title = "Current Currency"
        value = "Bitcoin"
        type = "button"
        onPress = {() => console.log("pressed button")}
        />


        </ScrollView>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    image:{
      width: 75,
      height: 75,
      borderRadius: 100,
      overflow: 'hidden',
      paddingBottom: 50,
    },
    username: {
      alignSelf:"center",
      fontSize:20,
    }
  });