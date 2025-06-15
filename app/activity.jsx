import {
	View,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Touchable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import ActivityCard from "../components/ActivityCard";
import EyeDetector from "../components/detector/EyeDetector";
import Graph from "../components/Graph";
import { useGlobalContext } from "../context/GlobalProvider";

const Activity = () => {
	const { time } = useLocalSearchParams();
  const {stats} = useGlobalContext()

  useEffect(()=>{
    console.log(stats);
    
  }, [])

	return (
		<SafeAreaView className="h-full w-full pb-2 pt-10 bg-olive-BLACK">
			<ScrollView>
				<View className="flex-row justify-center items-center px-8 py-4">
					<Text className="text-3xl text-center text-white">Activity</Text>
				</View>
				<View className="bg-olive-50 mt-4 justify-between pt-4 mx-4 rounded-2xl px-4">
					<View className="flex-row items-center justify-around ">
						{/* prev */}

						<TouchableOpacity className="bg-orange-peel-200 py-6 px-4 rounded-full">
							<FontAwesome name="angle-left" size={35} />
						</TouchableOpacity>

						{/* time  */}

						<View className="py-3 mt-3">
							<Text className="text-4xl text-center font-bold">{time}</Text>
							<Text className="text-lg font-semibold text-slate-600">
								Today, Monday 26
							</Text>
						</View>
						{/* next */}
						<TouchableOpacity className="bg-orange-peel-200 py-6 px-4 rounded-full">
							<FontAwesome name="angle-right" size={35} />
						</TouchableOpacity>
					</View>
					{/* graph */}

					<View className="h-72 pb-14">
						<Graph />
					</View>
				</View>
				<EyeDetector />
				<View className="bg-[#ffffff] mx-4 mb-4 mt-4 h-full rounded-xl items-center">
				{
          stats.map((stat, index)=>{
            if(stat.totalTimeInForeground > 0){
              return(
              <ActivityCard key={index} name={stat.appName} icon={stat.appIcon} time={stat.totalTimeInForeground}/>
            )
            }
            
          })
        }
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Activity;
