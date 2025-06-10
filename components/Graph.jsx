import { View, Text, ScrollView } from 'react-native'
import React from 'react'

const Graph = () => {
  return (
    <View style={{ elevation: 4, height: '100%', marginTop: 40 }} className=' border pt-4 px-4 flex-row justify-between items-end bg-olive-50 rounded-md gap-4'>
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
    <View className="w-[10%]">
      <View style={{ height: `${progress}%`, width: '75%', marginHorizontal: 4 }} className={`rounded-t-full bg-orange-peel-300`} />
      <Text className='text-center border-t border-orange-300'>{day.slice(0, 3)}</Text>
    </View>
  )
}
export default Graph