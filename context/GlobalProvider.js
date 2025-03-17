import { createContext, useContext, useEffect, useState } from "react";
import authService from "../libs/appwrite/auth";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkUser = async () => {
			try {
				const currentUser = await authService.getCurrentUser();
				if (currentUser) {
					setIsLoggedIn(true);
					setUser(currentUser);
				} else {
					setIsLoggedIn(false);
					setUser(null);
				}
			} catch (error) {
				console.log("Global Provider: ", error);
				setIsLoggedIn(false);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};
		checkUser();
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				isLoading,
				isLoggedIn,
				user,
				setIsLoggedIn,
				setUser,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};
