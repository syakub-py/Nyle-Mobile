import {Pressable, ScrollView, Text} from 'react-native';
import React, {useContext} from 'react';
import {AppContext} from '../../Contexts/NyleContext';


const categoryFilter = (text, masterData) => {
  if (text && text !== 'All') {
    return masterData.filter((item) => {
      const itemData = item.category ? item.category : '';
      return itemData.indexOf(text)>-1;
    });
  } else {
    return masterData;
  }
};

export default function CategoriesCarousell({masterData}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const nyleContext = useContext(AppContext);

  const handlePress = (index) => {
    setSelectedIndex(index);
    categoryFilter(inputArray[index], masterData);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {{paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10}}>
      {
        nyleContext.categories.map((item, index) => (
          <Pressable key = {index}
            onPress = {()=>handlePress(index)}
            style = {{backgroundColor: selectedIndex === index ? 'black' : 'whitesmoke', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginRight: 10}}
          >
            <Text style = {{color: selectedIndex === index ? '#ffffff' : '#000000', fontSize: 15, fontWeight: '500'}}>
              {item}
            </Text>
          </Pressable>
        ))
      }
    </ScrollView>
  );
}
