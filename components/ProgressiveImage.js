import React, { Component, PropTypes } from 'react'
import { Animated, View, Image, StyleSheet, Text } from 'react-native'

import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'

export default class ProgressiveImage extends Component {
  static defaultProps = {
    thumbnailBlurRadius: 5,
  }

  state = {
    imageOpacity: new Animated.Value(0),
    thumbnailOpacity: new Animated.Value(0),
  }

  onLoadThumbnail = () => {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 1,
      duration: this.props.thumbnailFadeDuration,
    }).start()
  }

  onLoadImage = () => {
    Animated.timing(this.state.imageOpacity, {
      toValue: 1,
      duration: this.props.imageFadeDuration,
    }).start()
  }

  render() {
    const { thumbnailBlurRadius, visible, small, large } = this.props

    return (
      <View
        style={{
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
        }}
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          source={{ uri: small, cache: 'force-cache' }}
          blurRadius={15}
        />
        <Animated.Image
          resizeMode="contain"
          style={[styles.image, { opacity: this.state.thumbnailOpacity }]}
          source={{ uri: small, cache: 'force-cache' }}
          onLoad={this.onLoadThumbnail}
          blurRadius={thumbnailBlurRadius}
        />
        {visible && (
          <Animated.Image
            resizeMode="contain"
            style={[styles.image, { opacity: this.state.imageOpacity }]}
            source={{ uri: large, cache: 'force-cache' }}
            onLoad={this.onLoadImage}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
})
