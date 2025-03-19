import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import authService from "../../libs/appwrite/auth";
import Logo from "../../components/Logo";
import OAuthGrid from "../../components/OAuthGrid";
import { useGlobalContext } from "../../context/GlobalProvider";
const SignIn = () => {
	const { setIsLoggedIn, setUser } = useGlobalContext();
	const [isSubmiting, setIsSubmiting] = useState(false);
	const submit = async () => {
		if (form.email.trim() === "" || form.password.trim() === "") {
			Alert.alert("Log In", "Please fill all the fields");
			return;
		}
		setIsSubmiting(true);
		try {
			const user = await authService.signIn(form.email, form.password);
			if (user) {
				setUser(user);
				setIsLoggedIn(true);
				router.replace("/home");
			} else {
				throw new Error("Failed to get user data");
			}
		} catch (error) {
			console.log("error", error);
			Alert.alert("Log In", error.message);
		} finally {
			setIsSubmiting(false);
		}
	};
	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	return (
		<SafeAreaView className="bg-olive-BLACK w-full h-full">
			<ScrollView>
				<View className="w-full justify-center h-full px-4 my-6">
					<Logo
						color="#9baf99"
						withName={true}
						size={50}
						className="mb-2"
						textClassName="text-5xl"
					/>
					<Text className="text-3xl text-gray-100 font-pthin">
						Log in to Drowse
					</Text>
					<View className="mt-20">
						<FormField
							placeholder={"Enter your email"}
							title="Email"
							value={form.email}
							onChangeText={(e) => setForm({ ...form, email: e })}
							otherStyles="mt-7"
							keyboardType="email-address"
						/>
						<FormField
							placeholder={"Enter your password"}
							title="Password"
							value={form.password}
							onChangeText={(e) => setForm({ ...form, password: e })}
							otherStyles="mt-7"
						/>
						<CustomButton
							containerStyle="mt-6"
							title={"Log In"}
							textStyle="text-olive-BLACK"
							isLoading={isSubmiting}
							handlePress={submit}
						/>
						<Text className="text-gray-200 mt-10 text-center">
							Don't have an account?{" "}
							<Link className="text-robins-egg-blue-300" href="sign-up">
								Sign Up
							</Link>
						</Text>
					</View>
					<View className="items-center">
						<OAuthGrid />
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignIn;
