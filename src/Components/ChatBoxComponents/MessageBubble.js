import {Bubble} from 'react-native-gifted-chat';
import React from 'react';

export default function MessageBubble({imageUrls, ...props}) {
  const wrapperStyle = {
    right: {
      backgroundColor: 'black',
      borderWidth: 3,
      borderRadius: 18,
      ...(imageUrls.length > 0 && {marginBottom: 90}),
    },
    left: {
      backgroundColor: '#ebebeb',
      borderWidth: 3,
      borderRadius: 18,
      borderColor: '#ebebeb',
      ...(imageUrls.length > 0 && {marginBottom: 90}),
    },
  };

  return (
    <Bubble
      {...props}
      wrapperStyle = {wrapperStyle}
      textStyle = {{
        right: {
          color: '#fff',
          flexWrap: 'wrap',
        },
        left: {
          flexWrap: 'wrap',
        },
      }}/>
  );
};
