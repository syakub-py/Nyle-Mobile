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


export default function ReviewCard({data}){
    const [open, setOpen] = React.useState(false);
    const [reply, setReply] = React.useState("")
    const SendReply = async () => {
        const docRef = firestore.collection("Reviews").doc(data.id);
        const doc = await docRef.get();

        if (doc.exists) {
            let existingReplies = doc.data().Replies;

            if (!existingReplies) {
                existingReplies = [];
            }

            const newReply = {
                username: data.Reviewe,
                message: reply,
                datePosted: new Date()
            };

            const updatedReplies = [...existingReplies, newReply];

            await docRef.update({ Replies: updatedReplies })
        }
    };

    const handleSendReply = () =>{
        SendReply().then(()=>{
            console.log("added")
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

                            <Pressable onPress={()=>handleSendReply()}>
                                <View style={{backgroundColor:'black', justifyContent:'center', borderRadius:30}}>
                                    <Ionicons name={"send"} size={15} color={"white"} style={{margin:7}}/>
                                </View>
                            </Pressable>


                        </View>

                    ):(
                        <Pressable onPress={()=>setOpen(!open)}>
                            <View style={{position:"absolute", bottom:0, right:10}}>
                                <Ionicons name={"arrow-redo-outline"} size={20}/>
                            </View>
                        </Pressable>

                    )
                }

            </View>

            {/*<ScrollView>*/}
            {/*    {*/}
            {/*        data.Replies.map((reply, index)=>(*/}
            {/*            <View>*/}
            {/*                <Text>{reply}</Text>*/}
            {/*            </View>*/}
            {/*        ))*/}
            {/*    }*/}
            {/*</ScrollView>*/}

        </View>
    )
}