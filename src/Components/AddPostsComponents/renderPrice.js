import React, {useEffect, useState} from 'react';
import {Dimensions, Image, Text, View} from 'react-native';
import {CheckBox} from 'react-native-elements';
import DropdownInput from '../../Components/AddPostDropdown';
import {CustomTextInput} from '../CustomText';

const RenderCurrencyItem = (item) => {
  return (
    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
      <Image source = {{uri: item.value}} style = {{width: 30, height: 30, margin: 10, borderRadius: 50}} />
      <Text>{item.label}</Text>
    </View>
  );
};

export default function RenderPrice({currencies, currencyList, setCurrencyList, setIsFocus}) {
  const [checked, setChecked] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({});
  const [price, setPrice] = useState(0);

  useEffect(() => {
    console.log('Selected currency updated, ', selectedCurrency);
  }, [selectedCurrency]);

  if (checked) {
    return (
      <View>
        <Text style={{fontSize: 25, fontWeight: 'bold', color: 'black', margin: 10}}>Price</Text>
        <View style={{margin: 10}}>
          <CheckBox
            title="Accept multiple currencies"
            checked={checked}
            onPress={() => setChecked(!checked)}
          />
        </View>
        <View style={{flexDirection: 'row', marginLeft: 30}}>
          <DropdownInput
            data={currencies}
            labelField="label"
            valueField="value"
            placeholder="Select a currency"
            onChange={(item) => {
              if (selectedCurrency !== null && selectedCurrency !== undefined && Object.keys(selectedCurrency).length !== 0) {
                if (Object.keys(item).length !== 0) {
                  setSelectedCurrency({...item, price: price});
                } else {
                  console.log('Selected currency is empty, not updating.');
                }
                console.log('Selected currency is empty, so not appending to the list.');
              }
            }}
            value={selectedCurrency}
            renderItem={RenderCurrencyItem}
            customStyle={{
              width: Dimensions.get('window').width / 3,
            }}
          />
          <CustomTextInput onChangeText={(text) => setPrice(text)} width={Dimensions.get('window').width / 2.5} />
        </View>

        <View style={{zIndex: 1, marginLeft: 15}}>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'black'}}>Currencies Accepted: </Text>
          {
            currencyList.map((item, index) => (
              <View key={index} style={{flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginBottom: 5}}>
                <Image source={{uri: item.value}} style={{height: 30, width: 30, borderRadius: 20}}/>
                <Text style={{marginLeft: 5}}>{item.label}</Text>
              </View>
            ))
          }
        </View>

      </View>
    );
  } else {
    return (
      <View>
        <Text style = {{fontSize: 25, fontWeight: 'bold', color: 'black', margin: 10}}>Price</Text>
        <View style={{margin: 10}}>
          <CheckBox
            title="Accept muliple currencies"
            checked={checked}
            onPress={()=>setChecked(!checked)}
          />
        </View>
        <View style = {{flexDirection: 'row', marginLeft: 30}}>

          <DropdownInput
            data={currencies}
            labelField = "label"
            valueField = "value"
            placeholder = "Select a currency"
            onChange={(item) => {
              const newSelectedCurrency = {...item, price: price};
              setSelectedCurrency(newSelectedCurrency);
              setCurrencyList([newSelectedCurrency]);
            }}
            value = {selectedCurrency}
            renderItem = {RenderCurrencyItem}
            customStyle = {{
              width: Dimensions.get('window').width / 3,
            }}
            setIsFocus={()=>setIsFocus(false)}
          />
          <CustomTextInput onChangeText={(text) => setPrice(text)} width={Dimensions.get('window').width/2.5}/>
        </View>
      </View>
    );
  }
}
