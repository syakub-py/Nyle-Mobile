import * as React from 'react';
import {
    Dimensions,
    Image, ImageBackground, Pressable,
    Text,
    View
} from 'react-native';
import {generateRating, handleLike} from "../GlobalFunctions";
import Ionicons from "react-native-vector-icons/Ionicons";


export default function MapPostCard({data, username}) {
    const [rating, setRating] = React.useState(0)
    const [numOfReviews, setNumOfReviews] = React.useState(0)

    React.useEffect(()=>{
        generateRating(data.PostedBy).then((result)=>{
            setRating(result.rating)
            setNumOfReviews(result.numOfReviews)
        })
    },[])

    return(
        <View style={{
            flex:1,
            height: 150,
            width: 170,
            margin: 10,
            flexDirection: 'row',
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 4 }}>

            <ImageBackground source={{uri:data.pic[0]}}  imageStyle={{ resizeMode: 'cover', borderRadius: 10 }} style={{ flex: 1 }}>
                <View style={{position:'absolute', right:10,top:10, height:30, width:30, borderRadius:12, justifyContent:'center', alignItems:'center'}}>
                    <Pressable onPress={()=>handleLike(data.title, username)}>
                        {
                            (data.likes.includes(data.PostedBy))?(
                                <Ionicons name='heart' size={20} color={'#e6121d'}/>
                            ):(
                                <Ionicons name='heart-outline' size={20}/>
                            )
                        }
                    </Pressable>
                </View>

                <View style={{ flex: 1 , flexDirection:"column", position:"absolute", bottom:10, backgroundColor:"white", alignSelf:'center', borderRadius:10, padding:5}}>

                    <Text style={{ fontSize:14, fontWeight:"500" }}>{data.title}</Text>
                    <View style={{flexDirection:"row", alignItems:'center', marginTop:10}}>
                        <View style={{flexDirection:"row", marginRight:10}}>
                            <Ionicons name={'star'} style={{marginRight:3}} color={"#ebd61e"} size={13}/>
                            <Text style={{fontSize:12, fontWeight:'bold'}}>{rating.toFixed(1)}</Text>
                        </View>

                        {
                            (data.category === "Homes")?(
                                <View style={{flexDirection:'row'}}>

                                    <View style={{flexDirection:"row", alignContent:'center'}}>
                                        <Ionicons name={'bed'} color={'black'} size={13}/>
                                        <Text style={{fontSize:12, color:'black', marginRight:10, marginLeft:5}}>{data.bedrooms}</Text>
                                    </View>

                                    <View style={{flexDirection:"row", alignContent:'center'}}>
                                        <Ionicons name={'water'} color={'black'} size={13}/>
                                        <Text style={{fontSize:12, color:'black', marginRight:10}}>{data.bathrooms}</Text>
                                    </View>
                                    <View style={{flexDirection:"row", alignContent:'center'}}>
                                        <Ionicons name={'expand'} color={'black'} size={13}/>
                                        <Text style={{fontSize:12, color:'black', marginRight:10, marginLeft:5}}>{data.SQFT}</Text>
                                    </View>
                                </View>
                            ):(
                                <View>
                                </View>
                            )
                        }
                    </View>
                    <Text style={{fontSize:10, color:'lightgrey', marginLeft:3}}>{numOfReviews} reviews</Text>

                </View>
            </ImageBackground>

        </View>
    )
}