import {Dimensions, Image, Modal, ScrollView, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, {Circle, Marker} from 'react-native-maps';
import React from 'react';
import CloseButton from '../CloseButton';

export default function RenderDetailModal({item, modalVisible, setModalVisible}) {
  const {height} = Dimensions.get('window');
  const {width} = Dimensions.get('window');
  if (modalVisible) {
    return (
      <View style={{flex: 1}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <View
              style={{
                backgroundColor: 'white',
                height: height /1.80,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                elevation: 2,
                borderColor: 'lightgray',
                borderWidth: 1,
              }}>

              <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                <View style={{position: 'absolute', top: 10, left: 10}}>
                  <CloseButton setModalVisible={setModalVisible}/>
                </View>

                <View style={{padding: 20}}>

                  <Text style={{fontWeight: 'bold', fontSize: 25, marginTop: 25, marginBottom: 10}}>{item.title}</Text>

                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    <Image
                      source={{uri: item.buyerProfilePic}}
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                      }}
                    />
                    <View style={{flexDirection: 'column', marginLeft: 7}}>
                      <Text style={{fontWeight: 'bold'}}>{item.buyer}</Text>
                      <Text style={{color: 'lightgray'}}>Buyer</Text>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    <Image
                      source={{uri: item.sellerProfilePic}}
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                      }}
                    />
                    <View style={{flexDirection: 'column', marginLeft: 7}}>
                      <Text style={{fontWeight: 'bold'}}>{item.seller}</Text>
                      <Text style={{color: 'lightgray'}}>Seller</Text>
                    </View>
                  </View>
                  <Text>{item.message}</Text>

                  <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
                    <View style={{flexDirection: 'row'}}>
                      <Ionicons name={'calendar-outline'} size={15} />
                      <View style={{flexDirection: 'column', marginLeft: 5}}>
                        <Text style={{color: 'lightgray', fontSize: 14}}>Date</Text>
                        <Text>{item.startTime}</Text>
                      </View>
                    </View>

                    <View style={{flexDirection: 'row', marginLeft: 20}}>
                      <Ionicons name={'time-outline'} size={15} />
                      <View style={{flexDirection: 'column', marginLeft: 5}}>
                        <Text style={{color: 'lightgray', fontSize: 14}}>Time</Text>
                        <Text>{item.startTime}</Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', marginLeft: 20}}>
                      <Ionicons name={'checkmark-outline'} size={15} />
                      <View style={{flexDirection: 'column', marginLeft: 5}}>
                        <Text style={{color: 'lightgray', fontSize: 14}}>Status</Text>
                        <Text>{item.status}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{width: width - 50, height: 300, alignSelf: 'center', marginBottom: 20, borderRadius: 20, overflow: 'hidden', elevation: 3}}>
                    <MapView style={{height: '100%', width: '100%'}} initialCamera={{center: item.coordinates, pitch: 0, heading: 0, zoom: 15, altitude: 0}} scrollEnabled={false}>
                      <Marker coordinate={item.coordinates} />
                      <Circle
                        center={item.coordinates}
                        radius={120}
                        fillColor="rgba(66, 135, 245, 0.2)"
                        strokeColor="rgba(66, 135, 245, 0.7)"
                        strokeWidth={1}
                      />
                    </MapView>
                  </View>

                </View>
              </ScrollView>
            </View>

          </View>
        </Modal>
      </View>
    );
  } else {
    return null;
  }
}
