import {
    View,
    Text,
    Image,
    Pressable,
    ScrollView,
    TextInput
} from 'react-native';
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {firestore} from "./Firebase";



/*
    @param data = {DatePosted:TimeStamp ,Replies: [{datePosted, message, username (posted by username)}, id:string (id of the doc in firestore), stars: int (number of stars)]
    @param currentUser = string (current username)
 */

export default function ReviewCard({data, currentUser}){
    const [open, setOpen] = React.useState(false);
    const [reply, setReply] = React.useState("")
    const SendReply = async () => {
        const docRef = firestore.collection("Reviews").doc(data.id);
        const doc = await docRef.get();

        if (doc.exists) {
            let existingReplies = doc.data().Replies || [];

            const newReply = {
                username: currentUser,
                message: reply,
                datePosted: new Date()
            };

            const updatedReplies = [...existingReplies, newReply];
            await docRef.update({ Replies: updatedReplies });
        }
    };

    const handleSendReply = () =>{
        SendReply().then(()=>{
            console.log("Added Reply")
        })
    }



    return(
        <View style={{ marginBottom: 10, margin: 10}}>

            <View>
                <View style={{ flexDirection: "row"}}>
                    <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }} />
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{marginLeft:5}}>{data.Reviewer}</Text>
                        <Text style={{marginLeft:5, fontWeight:'bold'}}>{data.Title}</Text>
                        <View style={{ flexDirection: "row", marginLeft:5}}>
                            {
                                Array.from({ length: data.stars }, (_, index) => (
                                    <Ionicons key={index} size={17} name={"star"} color={"#ebd61e"} />
                                ))
                            }
                        </View>
                    </View>
                </View>

                <View style={{paddingBottom:10}}>
                    <Text style={{marginTop:5}}>{data.ReviewMessage}</Text>
                </View>

                {
                    (open)?(
                        <View style={{flexDirection:'row', justifyContent:'center'}}>
                            <View style={{ width:300}}>
                                <TextInput multiline placeholder={"Write a reply"} onChangeText={(text)=>setReply(text)}/>
                            </View>

                            <Pressable onPress={handleSendReply}>
                                <View style={{backgroundColor:'black', justifyContent:'center', borderRadius:30}}>
                                    <Ionicons name={"send"} size={15} color={"white"} style={{margin:7}}/>
                                </View>
                            </Pressable>

                        </View>
                    ):(

                        (data.Reviewe === currentUser)?(
                            <Pressable onPress={()=>setOpen(!open)}>
                                <View style={{position:"absolute", bottom:0, right:10}}>
                                    <Ionicons name={"arrow-redo-outline"} size={20}/>
                                </View>
                            </Pressable>
                        ):(
                            <View>
                            </View>
                        )

                    )
                }

            </View>

            <ScrollView>
                {
                    data.Replies.map((reply, index)=>(
                        <View key={index} style={{marginLeft:30, marginTop:5}}>
                            <Text style={{fontWeight:'bold'}}>{reply.username}</Text>
                            <Text>{reply.message}</Text>
                        </View>
                    ))
                }
            </ScrollView>

        </View>
    )
}