import * as React from 'react';
import {
    Dimensions,
    Image,
    Text,
    View
} from 'react-native';
import {generateRating} from "../GlobalFunctions";
import Ionicons from "react-native-vector-icons/Ionicons";


export default function MapPostCard({data}) {
    const [rating, setRating] = React.useState(0)
    React.useEffect(()=>{
        generateRating(data.PostedBy).then((result)=>{
            setRating(result)
        })
    },[])
    return(
        <View style={{ height: 150, width:350, backgroundColor: 'white', borderRadius: 20, margin: 10, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                <Image source={{ uri: data.pic[0] }} style={{ height: 100, width: 100, borderRadius: 20 }} />
            </View>
            <View style={{ flex: 1 , flexDirection:"column"}}>
                <View style={{flexDirection:"row", alignItems:'center', }}>
                    <Image source={{uri:data.currency}} style={{height:20, width:20, marginRight:5, borderRadius:20}}/>
                    <Text style={{fontWeight:"bold", fontSize:20}}>{data.price}</Text>
                </View>
                <Text style={{ fontSize:17, fontWeight:"500" }}>{data.title}</Text>
                <Text style={{fontSize:12, color:"lightgrey"}}>{data.PostedBy}</Text>

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

            </View>
        </View>
    )
}