import {firestore} from '../Components/Firebase'
import {
    View,
    Text,
    ScrollView,
    Pressable,
} from 'react-native';
import React,{useState, useEffect} from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";

const getTerms = async (setTermsOfService) => {
    const Query = firestore.collection('Legal Docs').doc("Terms of Service");
    await Query.get().then((doc) => {
        setTermsOfService(doc.data().Data)
    })
}

export default function TermsOfService({route ,navigation}) {
    const [termsOfService, setTermsOfService] = useState("")

    useEffect(() => {
        getTerms(setTermsOfService);
    })

    const RenderShowButtons = () => {
        if (!route.params.showButtons) return <View/>
        return (
            <View style = {{flexDirection:'row', alignSelf:'center'}}>
                <Pressable>
                    <View style = {{width:"40%", alignItems:'center', justifyContent:'center', backgroundColor:'red', borderRadius:5, margin:10}}>
                        <Text style = {{color:'white', fontWeight:'bold', margin: 5}}>Decline</Text>
                    </View>
                </Pressable>
                <Pressable onPress = {() => {navigation.navigate("Main Container", {username:route.params.username})}}>
                    <View style = {{width:"40%", alignItems:'center', justifyContent:'center', backgroundColor:'green', borderRadius:5, margin:10}}>
                        <Text style = {{color:'white', fontWeight:'bold',margin:5}}>Accept</Text>
                    </View>
                </Pressable>
            </View>
        )
    }

    return (
        <View style = {{flex:1}}>
            <View style = {{ height:50, width:50, backgroundColor:'transparent', alignItems:'center', justifyContent:'center', marginRight:20, marginTop:20}}>
                <Pressable onPress = {() =>navigation.goBack()}>
                    <Ionicons name ='arrow-back-outline' size = {35}/>
                </Pressable>
            </View>

            <View style = {{justifyContent:'center'}}>
                <Text style = {{ fontWeight:'bold', alignSelf:'center', fontSize:25}}>Terms Of Service</Text>
                <View style = {{margin:10, height:550}}>
                    <ScrollView>
                        <Text style = {{color:'black'}}>
                            {termsOfService}
                        </Text>
                    </ScrollView>
                </View>

                <RenderShowButtons/>

            </View>
        </View>
    )
}
