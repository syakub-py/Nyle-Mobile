import _ from 'lodash';
import {Text, View} from 'react-native';
import React from 'react';

export default function Description({description, more, setMore}) {
  if (!_.isEmpty(description)) {
    const toggleShowFull = () => {
      setMore(!more);
    };

    const truncatedDescription = more ? description : `${description.slice(0, 500)}`;

    return (
      <View style={{marginBottom: 20}}>
        <Text style={{marginRight: 30, marginLeft: 30, color: 'grey', fontSize: 15}}>
          {truncatedDescription}
          {!more && description.length > 500 && (
            <Text style={{fontWeight: 'bold', color: 'black'}} onPress={toggleShowFull}>...more</Text>
          )}
        </Text>
      </View>
    );
  }
  return null;
}
