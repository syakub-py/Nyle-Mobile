import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet,SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import faker from 'faker'
import Ionicons from 'react-native-vector-icons/Ionicons';
import YourPostCard from './Components/YourPostsCard';

const SectionTitle = ({title}) => {
  return(
    <View style = {{marginTop: 20}}>
      <Text style={{color: 'gray', fontSize:20, fontWeight:'500'}}>{title}</Text>
    </View>)}

const Setting = ({title, type, onPress}) => {
  if (type == "button"){
    return(
      <TouchableOpacity style = {{flexDirection: 'row', height:50, alignItems:'center'}} onPress = {onPress}>
        <Text style = {{flex:1, color:'black', fontSize: 16, fontWeight:'bold'}}>{title}</Text>
        <View style = {{flexDirection:'row', alignItems:'center'}}>
          <Ionicons name='chevron-forward-outline' style={{color:'lightgray'}} size={19}/>
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
              <Image source = {{uri:`https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,}} style = {styles.image} resizeMode ="cover"/>
            </View>
          </View>

          {/* name */}
          <Text style = {styles.username}>{faker.name.findName()}</Text>
          {/* rest of settings screen */}
          <SectionTitle
          title = 'Account'
          />

          <Setting
          title = "Security"
          type = "button"
          onPress = {() => console.log("pressed button")}
          />

        <Setting
          title = "Appearance"
          type = "button"
          onPress = {() => console.log("pressed button")}
          />

      <Setting
          title = "Connect a wallet"
          type = "button"
          onPress = {() => console.log("pressed button")}
          />
          
      <Setting
          title = "2 factor Authentication"
          type = "button"
          onPress = {() => console.log("pressed button")}
          />



        <SectionTitle title={'Your Posts'}/>


        {/* test post card */}
        <YourPostCard/>

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
      width: 175,
      height: 175,
      borderRadius: 100,
      overflow: 'hidden',
      paddingBottom: 50,
    },
    username: {
      alignSelf:"center",
      fontSize:20,
    }
  });