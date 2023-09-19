import {Modal, ScrollView, View} from "react-native";
import {useState} from "react";
import _ from "lodash";
import CloseButton from "./CloseButton";


export default function ErrorPopUp({error}){
    const [isVisible, setIsVisible] =useState(!_.isUndefined(error))
    return(
        <Modal
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {setIsVisible(false)}}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: 280, height: 250, borderRadius: 20, flexDirection:'column'}}>
                    <View>
                        <CloseButton setModalVisible = {setIsVisible}/>
                    </View>
                    <View style={{backgroundColor:"red", height:'30%', width:'100%'}}>
                        <Text style={{color:'white', fontWeight:'bold',fontSize:20}}>Error: {error.name} {error.code}</Text>
                    </View>
                    <ScrollView horizontal style={{backgroundColor:'black'}}>
                        <Text style={{color:'whitesmoke', fontWeight:'semi-bold',fontSize:15}}>{error.message} {error.cause}</Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}