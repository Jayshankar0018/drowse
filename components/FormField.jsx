import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const FormField = ({
	title,
	value,
	onChangeText,
	otherStyles,
	placeholder,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<View className={`space-y-4 ${otherStyles}`}>
			<Text className="text-base text-olive-100 font-pmedium mb-2">{title}</Text>
			<View className="w-full h-16 px-4 bg-olive-950 rounded-2xl border-2 border-olive-600 focus:border-secondary flex flex-row items-center">
				<TextInput
					{...props}
					onChangeText={onChangeText}
					className="text-white flex-1 font-psemibold text-base"
					value={value}
					placeholder={placeholder}
					placeholderTextColor={"#7b7b8b"}
					secureTextEntry={title == "Password" && !showPassword}
				/>
				{title === "Password" && (
					<TouchableOpacity
						onPress={() => setShowPassword(!showPassword)}
						className="px-3 h-full justify-center"
					>
						<Image
							source={!showPassword ? icons.eye : icons.eyeHide}
							className="w-6 h-6"
							resizeMode="contain"
						/>
					</TouchableOpacity>
				)}
			</View>
                
		</View>
	);
};

export default FormField;
