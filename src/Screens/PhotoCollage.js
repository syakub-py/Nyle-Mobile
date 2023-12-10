import {Image, Pressable, ScrollView, View, Text} from 'react-native';
import React from 'react';
import BackButton from '../Components/BackButton';
import {useNavigation} from '@react-navigation/native';

export default function PhotoCollage({route}) {
  const pictures = route.params.pictures;
  const price = route.params.priceInUSD;
  const navigation =useNavigation();
  return (
    <View>
      <View style={{height: 80, backgroundColor: 'white'}}>

        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30}}>
          <View style = {{height: 50, width: 40, alignItems: 'center', justifyContent: 'center'}}>
            <BackButton />
          </View>

          <Image source={{uri: pictures[0]}} style={{height: 40, width: 40, marginRight: 6, borderRadius: 7}}/>

          <View style={{flexDirection: 'column'}}>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>{route.params.title}</Text>
            <Text style={{color: 'lightgray'}}>${Number(price).toLocaleString('en-US')}</Text>
          </View>

        </View>

      </View>

      <ScrollView bounces={false} contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white'}}>
        {
          pictures.map((photo, key) => {
            const height = 300;
            let width = '100%';

            if (key % 3 === 1 || key % 3 === 2) {
              width = '50%';
            }
            return (
              <Pressable
                key={key}
                style={{width, height}}
                onPress={() => navigation.navigate('Image Viewer', {pictures: pictures, index: key})}
              >
                <View style={{flex: 1, padding: 5}}>
                  <Image source={{uri: photo}} style={{flex: 1, width: '100%', height: '100%', borderRadius: 10}} />
                </View>
              </Pressable>
            );
          })
        }
      </ScrollView>
    </View>

  );
};
