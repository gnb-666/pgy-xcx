import { View, Image, Button, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import './share.less'

export default function Share() {
  const [successType, setSuccessType] = useState('share')

  useLoad(() => {
    console.log('Page loaded.')
    // 获取页面参数，确定成功类型
    const router = Taro.getCurrentInstance()
    const params = router?.router?.params || {}
    
    // 如果传入type参数，设置成功类型
    if (params.type) {
      setSuccessType(params.type)
    }
  })

  const toSuccess = () => {
    Taro.navigateBack()
  }

  // 根据成功类型显示不同文本
  const getSuccessText = () => {
    switch (successType) {
      case 'edit':
        return '修改成功'
      case 'share':
      default:
        return '分享成功'
    }
  }

  return (
    <View className='share-container'>
      <Image className='success-image' mode='widthFix' src={require('../../assets/images/suc.png')} />
      <View className='success-content'>
        <Text className='success-text'>{getSuccessText()}</Text>
        <Button className='back-button' onClick={toSuccess}>返回</Button>
      </View>
    </View>
  )
}
