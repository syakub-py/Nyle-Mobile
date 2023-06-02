import * as React from 'react';
import { View, SafeAreaView, FlatList, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import PostCard from './Components/PostCard.js';

export default function Categories({navigation, route}){
    console.log(route.params)
    const [filteredData, setfilterData] = React.useState([]);
    const [masterData, setMasterData] = React.useState([]);
    const[search, setSearch] = React.useState([])
    React.useEffect(()=>{
        setfilterData(route.params.Posts);
        setMasterData(route.params.Posts);
      }, [])

      const searchFilter = (text) =>{
        if (text){
          const newData = masterData.filter((item) =>{
            const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase()
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
    return(
        <SafeAreaView>
            <View style={{marginTop:50}}>
                <ScrollView>
                    <View style={{flexDirection:'row', height:80, shadowColor:'black', shadowOpacity:0.2}}>
                        <TextInput placeholder='Search...' onChangeText={(text) => searchFilter(text)} placeholderTextColor={'gray'} style={{flex:1, fontWeight:'400', backgroundColor:'white', margin:10, borderRadius:100, paddingHorizontal:15,elevation:2}}/>
                    </View>
                    <FlatList
                    data={filteredData}
                    renderItem = {({item}) => (
                        <TouchableOpacity onPress={() => navigation.navigate("post details", {PostTitle: item.title,Price:item.price, Details: item.details, Description:item.description, images: [item.pic], Currency:item.currency})}>
                            <PostCard data ={item}/>
                        </TouchableOpacity>
                        )}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    );

}