import {Text, View, Image, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CategoryCard = ({data}) =>{
    return(
        <TouchableOpacity>
            <View style = {{backgroundColor:'lightgray', borderRadius:7}}>
                <View>
                    <Image
                    source={{uri: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/model/aventador/aventador-svj-roadster/family/gallery/01_Gallery-Gateway-Famiglia.jpg'}}
                    resizeMode = "cover"
                    />
                </View>
                <Text>{data.title}</Text>
            </View>
        </TouchableOpacity>
    )
}