import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";

const CustomButton = ({
	title,
	containerStyle,
	isLoading,
	handlePress,
	textStyle,
}) => {
	return (
		<TouchableOpacity
			onPress={handlePress}
			className={`bg-robins-egg-blue-400 min-h-[62px] rounded-xl justify-center items-center ${containerStyle}`}
		>
			<Text className={`text-olive-BLACK font-psemibold text-lg ${textStyle}`}>
				{isLoading ? <ActivityIndicator color={"#161622"} size={"small"} /> : title}
			</Text>
		</TouchableOpacity>
	);
};

export default CustomButton;
