import React, {useState, useEffect} from 'react';
import {View, TextInput, Pressable, Text} from 'react-native';
import {auth} from "./Components/Firebase";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function EditProfile({navigation}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const updateUsername = async (newUsername) => {
        try {
            // Get the current user
            const currentUser = auth.currentUser;

            if (!currentUser) {
                console.error('No authenticated user found.');
                return;
            }

            // Update the username in the user profile
            await currentUser.updateProfile({ displayName: newUsername });

            alert('Username reset successful.');
        } catch (error) {
            alert('Error resetting username');
        }
    };

    const updatePassword = async (newPassword) => {
        try {
            // Get the current user
            const currentUser = auth.currentUser;

            if (!currentUser) {
                alert('No authenticated user found.');
                return;
            }

            // Update the password
            await currentUser.updatePassword(newPassword);

            alert('Password update successful.');
        } catch (error) {
            alert('Error updating password: '+ error);
        }
    };

    return (
        <View style = {{ flex: 1, padding: 16 , justifyContent:'center'}}>

            <View
                style = {{
                    position: 'absolute',
                    top: 30,
                    left: 15,
                    height: 50,
                    width: 50,
                    elevation: 2,
                    backgroundColor: 'white',
                    borderRadius: 13,
                    opacity: 0.7,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Pressable onPress= {() => {navigation.goBack()}}>
                    <Ionicons name ='chevron-back-outline' size = {30}/>
                </Pressable>
            </View>
            <TextInput
                style = {{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginBottom: 12,
                    paddingHorizontal: 8,
                }}
                placeholder="Username"
                value = {username}
                onChangeText= {text => setUsername(text)}
            />
            <Pressable
                style = {{
                    backgroundColor: 'black',
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 12,
                    alignItems: 'center',
                }}
                onPress= {() => updateUsername(username)}>
                <Text style = {{ color: 'white' }}>Update Username</Text>
            </Pressable>

            <TextInput
                style = {{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginBottom: 12,
                    paddingHorizontal: 8,
                }}
                placeholder="Password"
                secureTextEntry
                value = {password}
                onChangeText= {text => setPassword(text)}
            />
            <Pressable
                style = {{
                    backgroundColor: 'black',
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                }}
                onPress= {() => updatePassword(password)}
            >
                <Text style = {{ color: 'white' }}>Update Password</Text>
            </Pressable>
        </View>

    )
}
