import { View, Text, FlatList, Image, ScrollView, Pressable, TextInput, Alert, RefreshControl } from 'react-native';
import {firestore, firestoreLite} from './Components/Firebase'
import * as React from 'react';
import {collection, getDocs} from 'firebase/firestore/lite'
import { SafeAreaView } from 'react-native-safe-area-context';


  
export default function AddChat({route}){
    const [userList, setUserList] = React.useState([]);
    const [filteredData, setfilterData] = React.useState([]);
    const[search, setSearch] = React.useState([])

    const getUsers = async ()=>{
        const results =[];
        const chatCollection = collection(firestoreLite, "Users");
        const chatSnapshot = await getDocs(chatCollection);
        chatSnapshot.forEach(doc => {
          results.push(doc.data())
        });
        return results;
    }

    React.useEffect(()=>{
        getUsers().then((result) =>{
          const users = result
          setfilterData(users);
          setUserList(users);
        }).catch((error)=>{
          console.log(error)
        })
      }, [])

    const addChat = (collectionPath, receiver) =>{
        if (!collectionPath) {
            throw new Error('Error: collection name cannot be empty');
        }
        return firestore.collection(collectionPath).doc(receiver).set({
          key: faker.random.number({min:1, max:100}),
          image: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
          name: receiver,
          email: receiver,
          lastText:faker.lorem.lines(1)
        })
        .then(ref => {
          console.log('Added document with ID: ' + receiver);
        })
        .catch(error => {
          console.log('Error adding document: ', error);
        });
    }
    const searchFilter = (text) =>{
        if (text){
          const newData = userList.filter((item) =>{
            const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase()
            const textData = text.toUpperCase();
            return itemData.indexOf(textData)>-1;
          });
          setfilterData(newData);
          setSearch(text);
        }else{
          setfilterData(userList);
          setSearch(text);
        }
      }
    return(
        <View style={{flex:1, paddingTop:100}}>
            <FlatList
            ItemSeparatorComponent={
                <View style ={{height:1, backgroundColor:'lightgray', width:'100%', marginBottom:5}}/>
            }
            ListHeaderComponent={
                <View>
                    <TextInput placeholder='Search Users...' value={search} onChangeText={(text)=>{searchFilter(text)}}/>
                </View>
            }
            data={filteredData}
            />
        </View>
    )

}