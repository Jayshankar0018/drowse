import { View, Text, Image } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const ActivityCard = ({ icon, name, time }) => {
  return (
    <View className="py-4 px-4 flex-row mt-4 gap-4 border-b-[0.5px] w-[90%]">
      <View>
        {/* <FontAwesome name={icon} size={35} /> */}
        {
          icon? <Image 
          source={{ uri: `data:image/png;base64,${icon}`}}
          style={{
            width: 40,
            height: 40,
            marginRight: 10
          }}
          resizeMode="contain"
        />:<FontAwesome name="ban" size={40} style={{
          marginRight: 10,
          width: 40,
          height: 40
        }} />
        }
      </View>
      <View>
        <Text className="text-xl font-semibold">{name}</Text>
        <Text>{time}</Text>
      </View>
    </View>
  );
};

export default ActivityCard;
