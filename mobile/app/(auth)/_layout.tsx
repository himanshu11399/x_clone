import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import "../../global.css"
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { DarkTheme } from '@react-navigation/native';

export default function AuthRoutesLayout() {
  const { isSignedIn,isLoaded } = useAuth()

  if(!isLoaded){
    return(
      <View className='flex-1 bg-white justify-center items-center'>
        <ActivityIndicator size={"large"} color="#007AFF" />
      </View>
    )
  }

  if (!isSignedIn) {
    return <Stack  screenOptions={{headerShown:false,statusBarStyle:'dark'}} />

  } else {
    return <Redirect href={'/'} />
  }

}