import React, {useState, useEffect} from 'react';
import {
    ImageBackground,
    Pressable,
    Text,
    View
} from 'react-native';
import {generateRating, handleLike} from "../GlobalFunctions";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function MapPostCard({data, username}) {
    const [rating, setRating] = useState(0)
    const [numOfReviews, setNumOfReviews] = useState(0)

    useEffect(() => {
        generateRating(data.PostedBy).then((result) => {
            setRating(result.rating)
            setNumOfReviews(result.numOfReviews)
        })
    }, [])

    const renderDataPostedBy = () => {
        if (data.likes.includes(data.PostedBy)) {
            return (
                <Ionicons name='heart' size={20} color={'#e6121d'}/>
            )
        }
        return (
                <Ionicons name="heart-outline" size={17}  style={{ color: 'black' }}/>
        )
    }

    return (
        <View style = {{
            flex:1,
            height: 150,
            width: 190,
            margin: 10,
            flexDirection: 'row',
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 4 }}
        >

            <ImageBackground source = {{uri: data.pic[0]}}  imageStyle = {{ resizeMode: 'cover', borderRadius: 10 }} style = {{ flex: 1 }}>
                <View style = {{position:'absolute', right:7,top:7, height:30, width:30, borderRadius:12, justifyContent:'center', alignItems:'center'}}>
                    <Pressable onPress = {() =>handleLike(data.title, username)}>
                        {renderDataPostedBy()}
                    </Pressable>
                </View>

                <View style = {{flex: 1 , flexDirection:"row", position:"absolute", bottom:10, backgroundColor:"white", alignSelf:'center', borderRadius:10, padding:5, width:180}}>

                    <Text style = {{ fontSize:14, fontWeight:"500", alignSelf:'center', marginRight:15}}>{data.title}</Text>

                    <View style={{height:40, width:40, backgroundColor:'black', borderRadius:20, justifyContent:'center', alignItems:'center'}}>
                        <Ionicons name={"chevron-forward-outline"} size={25} color={"white"}/>
                    </View>

                    {/*<View style = {{flexDirection:"row", alignItems:'center', marginTop:10}}>*/}
                    {/*    <View style = {{flexDirection:"row", marginRight:10}}>*/}
                    {/*        <Ionicons name = {'star'} style = {{marginRight:3}} color = {"#ebd61e"} size = {13}/>*/}
                    {/*        <Text style = {{fontSize:12, fontWeight:'bold'}}>{rating.toFixed(1)}</Text>*/}
                    {/*    </View>*/}
                    {/*</View>*/}
                    {/*<Text style = {{fontSize:10, color:'lightgrey', marginLeft:3}}>{numOfReviews} reviews</Text>*/}
                </View>
            </ImageBackground>

        </View>
    )
}
