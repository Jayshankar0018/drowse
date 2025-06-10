import { View, Text, Image } from "react-native";
import { Tabs, Redirect } from "expo-router";

import { icons } from "../../constants";

const TabIcon = ({ icon, name, color, focused }) => {
	return (
		<View className="flex items-center w-20 mt-3">
			<Image
				source={icon}
				tintColor={color}
				resizeMode="contain"
				className="w-7 h-7 my-1"
			/>
			<Text
				className={`text-xs ${focused ? "font-psemibold" : "font-pregular"}`}
				// numberOfLines={1}
				style={{ color: color }}
			>
				{name}
			</Text>
		</View>
	);
};

const TabLayout = () => {
	return (
		<>
			<Tabs
				screenOptions={{
					tabBarShowLabel: false,
					tabBarActiveTintColor: "#FFA001",
					tabBarInactiveTintColor: "#CDCDE0",
					tabBarStyle: {
						backgroundColor: "#2e382e",
						height: 70,
					},
				}}
			>
				<Tabs.Screen
					name="home"
					options={{
						headerShown: false,
						title: "Home",
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								color={color}
								focused={focused}
								icon={icons.home}
								name="Home"
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						headerShown: false,
						title: "Profile",
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								color={color}
								focused={focused}
								icon={icons.profile}
								name="Profile"
							/>
						),
					}}
				/>
				
			</Tabs>
		</>
	);
};

export default TabLayout;
