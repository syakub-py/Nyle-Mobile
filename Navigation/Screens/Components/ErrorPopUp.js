import {Modal, ScrollView, View} from "react-native";
import {useState} from "react";
import _ from "lodash";


export default function ErrorPopUp({error}){
    const [isVisible, setIsVisible] =useState(!_.isNull(error))
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Modal
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {setIsVisible(false)}}>
                <View style={{flexDirection:'column'}}>
                    <View style={{backgroundColor:"red", height:'50%', width:'100%'}}>
                        <Text style={{color:'white', fontWeight:'bold',fontSize:20}}>Error: {error.name} {error.code}</Text>
                    </View>
                    <ScrollView horizontal>
                        <Text style={{color:'whitesmoke', fontWeight:'bold',fontSize:20}}>{error.message} {error.cause}</Text>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    )
}