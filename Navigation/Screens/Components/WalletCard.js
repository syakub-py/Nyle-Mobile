import React from 'react';
import {View, Text, StyleSheet, Image, TextInput} from 'react-native';

const WalletCard = ({ wallet }) => {
    return (
        <View style={styles.container}>
            <View style={styles.walletContainer}>
                <View style={styles.cardContainer}>
                    <View style={styles.cardContent}>
                        <View style={styles.walletLogoContainer}>
                            <Image
                                source={{ uri: wallet.item.walletProvider }}
                                style={styles.walletLogo}
                            />
                        </View>

                        <View style={styles.walletInfo}>
                            <TextInput style={styles.walletName} value={wallet.item.name}/>
                            <Text>${wallet.item.balance}</Text>
                            <Text style={styles.walletAddress}>{wallet.item.address}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'whitesmoke',
        marginBottom: 10,
        margin: 20,
        borderRadius: 10,
        elevation: 2,
    },
    walletContainer: {
        width: '100%',
        height: 200,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    walletLogoContainer: {
        margin: 10,
    },
    walletLogo: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
    walletInfo: {
        marginLeft: 10,
    },
    walletName: {
        fontWeight: 'bold',
        backgroundColor:"lightgrey",
        color:'black',
        paddingHorizontal:10,
        borderRadius:5,
        fontSize: 19,
    },
    walletAddress: {
        color: 'lightgrey',
    },
});

export default WalletCard;
