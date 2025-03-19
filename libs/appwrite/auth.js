import {
	Client,
	Account,
	ID,
	Avatars,
	Databases,
	Query,
} from "react-native-appwrite";
import { conf } from "../../constants/config";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from 'expo-web-browser';

class Authentication {
	client;
	account;
	avatar;
	databases;
	constructor() {
		this.client = new Client()
			.setEndpoint(conf.endpoint)
			.setProject(conf.projectId)
			.setPlatform(conf.platform);
		this.account = new Account(this.client);
		this.avatar = new Avatars(this.client);
		this.databases = new Databases(this.client);
	}

	createAccount = async (username, email, password) => {
		try {
			const newAccount = await this.account.create(
				ID.unique(),
				email,
				password,
				username
			);
			if (!newAccount)
				throw Error("Something went wrong while creating an account");
			const avatarUrl = this.avatar.getInitials(username);
			const session = await this.signIn(email, password);

			const newUser = await this.databases.createDocument(
				conf.databaseId,
				conf.usersCollectionId,
				ID.unique(),
				{
					accountId: newAccount.$id,
					username,
					email,
					avatar: avatarUrl,
				}
			);

			// Store user data in AsyncStorage
			await AsyncStorage.setItem("user", JSON.stringify(newUser));
			await AsyncStorage.setItem("session", JSON.stringify(session));

			return {
				user: newUser,
				session,
			};
		} catch (error) {
			console.log(error);
			throw new Error(error.message || "Failed to create account");
		}
	};

	signIn = async (email, password) => {

		if (this.account) {
			console.log(this.account);
		}

		let session = null;
		let user = null;

		try {
			// Create email session
			console.log("1");
			session = await this.account.createEmailPasswordSession(email, password);
			console.log("2");
			if (!session?.$id) {
				throw new Error("Invalid session response");
			}

			// Store session immediately
			await AsyncStorage.setItem("session", JSON.stringify(session));

			// Get account info
			const currentAccount = await this.account.get();
			if (!currentAccount?.$id) {
				throw new Error("Failed to retrieve account information");
			}

			// Get user data
			const userData = await this.databases.listDocuments(
				conf.databaseId,
				conf.usersCollectionId,
				[Query.equal("accountId", currentAccount.$id)]
			);

			if (!userData?.documents?.length) {
				throw new Error("User data not found in database");
			}

			user = userData.documents[0];
			await AsyncStorage.setItem("user", JSON.stringify(user));
			return user;

		} catch (error) {
			// Clean up any stored data on error
			await AsyncStorage.removeItem("session");
			await AsyncStorage.removeItem("user");

			// Handle specific error cases
			if (error.message.includes("Invalid credentials")) {
				throw new Error("Invalid email or password");
			}

			console.error("Sign in error:", error);
			throw new Error(error.message || "Failed to sign in");
		}
	};

	logout = async () => {
		try {
			const result = await this.account.deleteSession("current");
			// Clear AsyncStorage
			await AsyncStorage.removeItem("user");
			await AsyncStorage.removeItem("session");
			console.log("delete sessions: ", result);
			Alert.alert("Aora", "Successfully Logged out");
		} catch (error) {}
	};

	getCurrentUser = async () => {
		try {
			// First check AsyncStorage
			const storedUser = await AsyncStorage.getItem("user");
			if (storedUser) {
				return JSON.parse(storedUser);
			}

			// If no stored user, check Appwrite
			const currentAccount = await this.account.get();
			if (!currentAccount) throw Error;

			const logedInUser = await this.databases.listDocuments(
				conf.databaseId,
				conf.usersCollectionId,
				[Query.equal("accountId", currentAccount.$id)]
			);

			if (!logedInUser || !logedInUser.documents.length) throw Error;

			// Store user data in AsyncStorage
			await AsyncStorage.setItem(
				"user",
				JSON.stringify(logedInUser.documents[0])
			);
			return logedInUser.documents[0];
		} catch (error) {
			// Clear AsyncStorage on error
			await AsyncStorage.removeItem("user");
			await AsyncStorage.removeItem("session");
			return null;
		}
	};

	googleOauth2 = async () => {
		try {
			const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));

			if (!deepLink.hostname) {
				deepLink.hostname = "localhost";
			}

			const scheme = `${deepLink.protocol}//`;

			const loginUrl = await this.account.createOAuth2Token(
				"google",
				`${deepLink}`,
				`${deepLink}`
			);

			let result;
			try {
				result = await WebBrowser.openAuthSessionAsync(
					`${loginUrl}`,
					scheme,
					{
						showInRecents: true,
						preferEphemeralSession: true
					}
				);
			} catch (browserError) {
				console.error('Browser session error:', browserError);
				throw new Error('Failed to open authentication window');
			} finally {
				await WebBrowser.coolDownAsync();
			}

			if (result.type === 'success') {
				const url = new URL(result.url);
				const secret = url.searchParams.get("secret");
				const userId = url.searchParams.get("userId");

				if (!secret || !userId) {
					throw new Error('Failed to get authentication credentials');
				}

				await this.account.createSession(userId, secret);
				const userData = await this.getCurrentUser();
				
				// Store session data
				const session = await this.account.getSession(userId);
				await AsyncStorage.setItem("session", JSON.stringify(session));
				await AsyncStorage.setItem("user", JSON.stringify(userData));
				
				return userData;
			} else if (result.type === 'cancel') {
				throw new Error('Authentication was cancelled by the user');
			} else {
				throw new Error('Authentication failed');
			}
		} catch (error) {
			console.error('Google OAuth Error:', error);
			Alert.alert("Authentication Error", error.message || 'Failed to authenticate with Google');
			throw error;
		}
	};

	appleOauth2 = async () => {
		try {
			const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));

			if (!deepLink.hostname) {
				deepLink.hostname = "localhost";
			}

			const scheme = `${deepLink.protocol}//`;

			const loginUrl = await this.account.createOAuth2Token(
				"apple",
				`${deepLink}`,
				`${deepLink}`
			);

			const result = await WebBrowser.openAuthSessionAsync(
				`${loginUrl}`,
				scheme
			);

			if (result.type === 'success') {
				const url = new URL(result.url);
				const secret = url.searchParams.get("secret");
				const userId = url.searchParams.get("userId");

				if (!secret || !userId) {
					throw new Error('Failed to get authentication credentials');
				}

				await this.account.createSession(userId, secret);
				const userData = await this.getCurrentUser();
				
				// Store session data
				const session = await this.account.getSession(userId);
				await AsyncStorage.setItem("session", JSON.stringify(session));
				await AsyncStorage.setItem("user", JSON.stringify(userData));
				
				return userData;
			} else {
				throw new Error('Authentication was cancelled or failed');
			}
		} catch (error) {
			console.error('Apple OAuth Error:', error);
			Alert.alert("Authentication Error", error.message || 'Failed to authenticate with Apple');
			throw error;
		}
	};
}

const authService = new Authentication();
export default authService;
