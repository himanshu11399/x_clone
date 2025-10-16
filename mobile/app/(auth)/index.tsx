import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import "../../global.css"
import React, { useState } from 'react';
import { useSocialAuth } from "../../hooks/useSocialAuth"

export default function Index() {
  const { handleSocialAuth, isLoading } = useSocialAuth()

  const [color, setColor] = useState('white');

  const handleLongPress = () => {
    setColor(color === '#AAACFA' ? 'white' : '#AAACFA');
  };


  return (
    <View className="flex-1 bg-white">

      <View className="flex-1 px-8 justify-between white">
        <View className="flex-1 justify-center">
          {/*Image */}
          <Image source={require("../../assets/images/auth2.png")}
            className="size-96"
            resizeMode="contain"
          />
          {/* For buttons - Google*/}
          <View className="flex-col gap-2">
            <TouchableOpacity
              className="flex-row items-center justify-center border
            border-gray-300 rounded-full py-3 px-6"

              onPress={() => handleSocialAuth("oauth_google")}
              disabled={isLoading}
              style={{
                backgroundColor: color,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                elevation: 2

              }}
              onLongPress={handleLongPress}
            >
              {isLoading ? (
                <ActivityIndicator size={"small"} color={"#000"} />
              ) : (
                <View className="flex-row justify-center items-center">
                  <Image
                    source={require("../../assets/images/google.png")}
                    className="size-10 mr-3 "
                    resizeMode="contain" />
                  <Text className="text-black font-medium text-base">
                    Continue With Google</Text>
                </View>
              )}

            </TouchableOpacity>
          </View>
          {/* For buttons - Apple*/}
          <View className="flex-col gap-2 mt-2">
            <TouchableOpacity
              className="flex-row items-center justify-center border
            border-gray-300 rounded-full py-3 px-6"

              onPress={() => handleSocialAuth("oauth_apple")}
              disabled={isLoading}
              style={{
                backgroundColor: color,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                elevation: 2

              }}
              onLongPress={handleLongPress}
            >
              {isLoading ? (
                <ActivityIndicator size={"small"} color={"#000"} />
              ) : (
                <View className="flex-row justify-center items-center">
                  <Image
                    source={require("../../assets/images/apple.png")}
                    className="size-9 mr-3 "
                    resizeMode="contain" />
                  <Text className="text-black font-medium text-base">
                    Continue With Apple</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/*Privacy Policy */}
          <Text className="text-center text-gray-500 texxt-xs leading-4 mt-6 px-2" >
            By Signing up, you agree to our
            <Text className="text-blue-500"> Terms</Text>
            {", "}
            <Text className="text-blue-500">Privacy Policy</Text>
            {", and "}
            <Text className="text-blue-500">Cookie Use</Text>
          </Text>
        </View>
      </View>

    </View>

  );
}

