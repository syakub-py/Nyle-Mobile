import React, {useState, useEffect} from 'react';
import {View, FlatList, Pressable, Text} from 'react-native';
import WalletCard from "./Components/WalletCard";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ConnectedWallets({navigation}) {

    const wallets = [
        { name: 'Coinbase Wallet', address: '0xabc12385038**********', balance:"10,964", walletProvider:"https://altcoinsbox.com/wp-content/uploads/2022/12/coinbase-logo.png" },
        { name: 'MetaMask Wallet', address: '0xdef45653908**********', balance:"100,749" , walletProvider:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png" },
        { name: 'FTX Wallet', address: '0xghi78957395**********', balance:"234,324" ,walletProvider:"https://i.pinimg.com/originals/23/ae/af/23aeaf41d1cefffadf15692d792e9289.png" },
    ];

    return (
        <View>
            <View style = {{zIndex:1}}>
                <View style = {{position: 'absolute', top: 30, left: 15, height:50, width:50, elevation:2 , backgroundColor:'white', borderRadius:13, opacity:0.7, alignItems:'center', justifyContent:'center'}}>
                    <Pressable onPress= {() =>navigation.goBack()}>
                        <Ionicons name ='chevron-back-outline' size = {30}/>
                    </Pressable>
                </View>
            </View>

            <FlatList
            data= {wallets}
            renderItem= {(CurrentWallet) =>(
                <WalletCard wallet= {CurrentWallet}/>
            )}
            ListFooterComponent= {
                <View>
                    <Pressable>
                        <View style = {{backgroundColor:'black', height:50, width:"100%"}}>
                            <Text>Add a Wallet</Text>
                        </View>
                    </Pressable>
                </View>
            }
            />
        </View>
    )
}