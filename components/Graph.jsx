import { View, Text, ScrollView } from 'react-native'
import React from 'react'

const Graph = () => {
  return (
    <View style={{ elevation: 4, height: '100%', marginTop: 40 }} className=' border pt-4 px-4 flex-row items-end bg-[#f4fcfd] rounded-md gap-4'>
      <Bar progress={55} day={"Monday"} />
      <Bar progress={85} day={"Tuesday"} />
      <Bar progress={25} day={"Thursday"} />
      <Bar progress={35} day={"Wednesday"} />
      <Bar progress={55} day={"Friday"} />
      <Bar progress={95} day={"Saturday"} />
      <Bar progress={15} day={"Sunday"} />
    </View>
  )
}

const Bar = ({ progress, day }) => {

  return (
    <View style={{ width: '10%' }}>
      <View style={{ height: `${progress}%`, width: '100%', marginHorizontal: 4 }} className={`rounded-t-full bg-[#086aa3cb]`} />
      <Text className='text-center'>{day.slice(0, 3)}</Text>
    </View>
  )
}
export default Graph