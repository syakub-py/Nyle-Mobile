import {Modal, View} from 'react-native';
import MenuButton from '../MenuButtons';
import React from 'react';


export default function MenuButtonModal({isOpen, setIsOpen}) {
  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      onRequestClose={() => setIsOpen(!isOpen)}
      transparent={true}>

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{width: 280, height: 250, backgroundColor: '#fff', borderRadius: 20, flexDirection: 'column', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <MenuButton title={'Share'} onPress={() => {}} iconName={'share-social-outline'} style={{backgroundColor: 'whitesmoke', width: 120, height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center', margin: 10}} />
            <MenuButton title={'Report'} onPress={() => {}} iconName={'alert-outline'} style={{backgroundColor: 'whitesmoke', width: 120, height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center', margin: 10}} />
          </View>
          <View style={{flexDirection: 'row'}}>
            <MenuButton title={'Share'} onPress={() => {}} iconName={'share-social-outline'} style={{backgroundColor: 'whitesmoke', width: 120, height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center', margin: 10}} />
            <MenuButton title={'Report'} onPress={() => {}} iconName={'alert-outline'} style={{backgroundColor: 'whitesmoke', width: 120, height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center', margin: 10}} />
          </View>
        </View>
      </View>

    </Modal>
  );
}
