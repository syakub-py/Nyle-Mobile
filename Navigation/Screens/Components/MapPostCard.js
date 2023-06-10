import * as React from 'react';
import {
    Image,
    Text,
    View
} from 'react-native';
import {generateRating} from "../GlobalFunctions";


export default function MapPostCard({data}) {
    const [rating, setRating] = React.useState(0)
    React.useEffect(()=>{
        generateRating(data.PostedBy).then((result)=>{
            setRating(result)
        })
    },[])
    return(
        <View style={{ height: 150, width:300, backgroundColor: 'white', borderRadius: 20, margin: 10, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                <Image source={{ uri: data.pic[0] }} style={{ height: 100, width: 100, borderRadius: 20 }} />
            </View>
            <View style={{ flex: 1 , flexDirection:"column"}}>
                <Text style={{ textAlign: 'center' }}>{data.title}</Text>
                <Text>{data.PostedBy}</Text>

                <View style={{flexDirection:"row", alignItems:'center', justifyContent:'center'}}>
                    <Image source={{uri:data.currency}} style={{height:12, width:12, marginRight:5, borderRadius:20}}/>
                    <Text>{data.price}</Text>
                </View>
            </View>
        </View>
    )
}