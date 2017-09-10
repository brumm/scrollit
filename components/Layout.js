import React from 'react'
import { View, Platform } from 'react-native'
import glamorous from 'glamorous-native'
import { BlurView, VibrancyView } from 'react-native-blur'

export const InfoBox = glamorous.view(
  {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
  },
  ({ position = 'top' }) => ({
    [position]: 0,
  })
)

export const Text = glamorous.text(
  {
    color: '#fafafa',
  },
  ({ small }) => ({
    fontSize: small ? 12 : 18,
  })
)

export const Vibrant = ({ children, ...props }) => {
  const Container = glamorous(Platform.OS === 'ios' ? VibrancyView : View)({
    paddingVertical: 5,
    paddingHorizontal: 5,
  })
  return Platform.OS === 'ios' ? (
    <Container {...props}>{children}</Container>
  ) : (
    <Container {...props}>
      <BlurView />
      {children}
    </Container>
  )
}

class AdaptingHeight extends React.Component {
  state = {
    height: new Animated.Value(1),
  }

  onLayout = ({ nativeEvent: { layout: { height } } }) =>
    Animated.timing(this.state.height, {
      toValue: height,
      duration: 150,
    }).start()

  render() {
    const { children } = this.props
    const { height } = this.state

    return (
      <Animated.View style={[{ height }, { overflow: 'hidden', position: 'relative' }]}>
        <View onLayout={this.onLayout} style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          {children}
        </View>
      </Animated.View>
    )
  }
}
