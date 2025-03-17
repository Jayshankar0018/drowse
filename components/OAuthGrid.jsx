import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import authService from "../libs/appwrite/auth";

const OAuthGrid = () => {
  const [isLoading, setIsLoading] = useState({
    apple: false,
    google: false
  });

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(prev => ({ ...prev, apple: true }));
      await authService.appleOauth2();
    } catch (error) {
      console.error('Apple Sign In Error:', error.message);
    } finally {
      setIsLoading(prev => ({ ...prev, apple: false }));
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(prev => ({ ...prev, google: true }));
      await authService.googleOauth2();
    } catch (error) {
      console.error('Google Sign In Error:', error.message);
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  }

  return (
    <View className="px-3 py-2 flex items-center mt-3 w-[70%]">
      <View className="bg-olive-400 h-[1px] w-full mb-2"></View>
      <View className="flex-row ">
        <TouchableOpacity 
          onPress={handleAppleSignIn} 
          disabled={isLoading.apple}
          className="flex-row gap-2 flex-1 py-2 px-2 flex justify-center items-center"
        >
          {isLoading.apple ? (
            <ActivityIndicator color="#748e73" />
          ) : (
            <>
              <AntDesign name="apple1" size={24} color="#748e73" />
              <Text className="text-olive-400">Apple</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleGoogleSignIn} 
          disabled={isLoading.google}
          className="flex-row gap-2 flex-1 py-2 px-2 flex justify-center items-center"
        >
          {isLoading.google ? (
            <ActivityIndicator color="#748e73" />
          ) : (
            <>
              <AntDesign name="google" size={24} color="#748e73" />
              <Text className="text-olive-400">Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OAuthGrid;
