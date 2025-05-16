import { View, Text } from 'react-native'
import React from 'react'
import authService from '../../libs/appwrite/auth'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const Profile = () => {

  const submit = async () => {
    try{
      authService.logout();
      router.replace("sign-in")
    }catch(e){
      console.log("ERROR : ", e);
      
    }
  } 

  return (
    <View>
      <Text>Profile</Text>
      <CustomButton
							containerStyle="mt-6"
							title={"Logout"}
							textStyle="text-olive-BLACK"
							// isLoading={isSubmiting}
							handlePress={submit}
						/>
    </View>
  )
}

export default Profile