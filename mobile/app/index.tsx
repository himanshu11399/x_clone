import { View, Text, TouchableOpacity } from 'react-native'
import { useClerk } from '@clerk/clerk-expo'
import React from 'react'

const HomeScreen = () => {
    const {signOut}=useClerk();
  return (
    <View>
     <TouchableOpacity onPress={()=>signOut()}>
        <Text>Logout</Text>
     </TouchableOpacity>
    </View>
  )
}

export default HomeScreen