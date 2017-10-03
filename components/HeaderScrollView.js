import React, { Component } from 'react'
import { View, Image, StyleSheet, ScrollView, Text, Animated, StatusBar } from 'react-native'

export default class HeaderScrollView extends Component {
  yOffset = new Animated.Value(0)
  state = {
    headerHeight: 0,
  }

  onScrollHandler = Animated.event([{ nativeEvent: { contentOffset: { y: this.yOffset } } }], {
    useNativeDriver: false,
  })

  render() {
    const { children, headerComponent, headerMinHeight, ...scrollViewProps } = this.props
    const { headerHeight } = this.state

    return (
      <Animated.ScrollView
        onScroll={this.onScrollHandler}
        scrollEventThrottle={1}
        {...scrollViewProps}
      >
        <Animated.View
          onLayout={({ nativeEvent: { layout: { height: headerHeight } } }) =>
            this.state.headerHeight === 0 && this.setState({ headerHeight })}
          style={{
            flexGrow: this.yOffset.interpolate({
              inputRange: [0, headerHeight],
              outputRange: [1, 0],
            }),
            minHeight: headerMinHeight,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {headerComponent}
        </Animated.View>
        <View
          style={{
            flexShrink: 0,
          }}
        >
          {children}
        </View>
      </Animated.ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  header: {},
})
