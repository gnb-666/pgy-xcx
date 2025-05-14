import { View, Image, Button, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './share.less'

export default function Share() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  const toSuccess = () => {
    Taro.navigateBack()
  }

  return (
    <View className='share-container'>
      <Image className='success-image' mode='widthFix' src={require('../../assets/images/suc.png')} />
      <View className='success-content'>
        <Text className='success-text'>分享成功</Text>
        <Button className='back-button' onClick={toSuccess}>返回</Button>
      </View>
    </View>
  )
}
