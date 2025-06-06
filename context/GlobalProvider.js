import { createContext, useContext, useEffect, useState } from "react";
import authService from "../libs/appwrite/auth";
import { NativeModules, Linking, Alert, Platform } from "react-native";

import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function for enabling admin previledge
  const enableDeviceAdmin = () => {
    try {
      const intent = {
        action: "android.app.action.ADD_DEVICE_ADMIN",
        data: {
          "android.app.extra.DEVICE_ADMIN": new ComponentName(
            "com.bismay.drowse",
            "com.bismay.drowse.DeviceAdminReceiver"
          ),
          "android.app.extra.EXPLANATION":
            "This app needs device admin to lock the screen.",
        },
      };
      Linking.sendIntent(intent.action, intent.data);
      // return true
    } catch (e) {
      Alert.alert(
        "Error",
        "Please enable device admin manually in Settings > Security > Device Administrators"
      );
    }
  };

  // Defining Background task
  const BACKGROUND_LOCK_TASK = "background-lock-screen";

  TaskManager.defineTask(BACKGROUND_LOCK_TASK, async () => {
    try {
      console.log("Running screen lock task");
      if (NativeModules.ScreenLock) {
        await NativeModules.ScreenLock.lockScreen();

        const usageStats = await new Promise((resolve, reject) => {
          NativeModules.ScreenLock.getAppUsageStats(
            (result) => resolve(result),
            (error) => reject(error)
          );
        });
        console.log("App Usage Stats : ", usageStats);

        return BackgroundFetch.BackgroundFetchResult.NewData;
      }
    } catch (error) {
      console.error("Background task error:", error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });

  const getUsageStats = async () => {
    console.log("clicking");
    // const usageStats = await new Promise((resolve, reject) => {
    //   NativeModules.ScreenLock.getAppUsageStats(
    //     (result) => {
    //       console.log("Raw usage stats:", result);

    //       resolve(result);
    //     },
    //     (error) => {
    //       console.log("ERROR : ", error);

    //       reject(error);
    //     }
    //   );
    // });

    const stats = await new Promise((resolve, reject) => {
      NativeModules.ScreenLock.getAppUsageStats(resolve, reject);
    });
    console.log("Stats : ", stats);

    // console.log("App Usage Stats : ", usageStats);
  };

  const lockSystem = async () => {
    try {
      // TaskManager.startTask(BACKGROUND_LOCK_TASK);
      if (NativeModules.ScreenLock) {
        const res = NativeModules.ScreenLock.lockScreen();
        if (res.status !== 200) {
          Alert.alert("Error", "Failed to lock screen");
        }
      }
      // enableDeviceAdmin();
    } catch (e) {
      console.log(e);
    }
  };

  const requestUsageStatsPermission = () => {
    if (Platform.OS === "android") {
      try {
        Linking.openSettings();
        Alert.alert(
          "Permission Required",
          'Please enable "Apps with usage access" for this app in Settings > Security.'
        );
      } catch (error) {
        Alert.alert("Error", "Unable to open settings: " + error.message);
      }
    }
  };

  // Registering the background task
  const registerBackgroundTask = async () => {
    const status = BackgroundFetch.getStatusAsync();
    const isRegistered =
      TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCK_TASK);
    console.log(isRegistered);

    if (status === BackgroundFetch.BackgroundFetchStatus.Restricted) {
      console.log("Background execution is restricted");
      return;
    }
    await BackgroundFetch.registerTaskAsync(BACKGROUND_LOCK_TASK, {
      minimumInterval: 10 * 60,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  };

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
        enableDeviceAdmin,
        registerBackgroundTask,
        lockSystem,
        getUsageStats,
        requestUsageStatsPermission,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
