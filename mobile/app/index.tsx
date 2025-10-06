import { Text, View, StyleSheet } from "react-native";
import {Ionicons} from "@expo/vector-icons"
import "../global.css"

export default function Index() {
  return (
   <View className="flex-1 items-center justify-center bg-gray-500">
      <Text className="text-xl font-bold text-blue-500 ">
        Welcome to Nativewind!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cebbbbff"

  }
})