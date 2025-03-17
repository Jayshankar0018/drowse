import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from '../../components/Logo'


const Home = () => {
	return (
		<SafeAreaView className="bg-olive-BLACK h-full">
			<Logo />
		</SafeAreaView>
	);
};

export default Home;
