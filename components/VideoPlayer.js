import React from 'react'
import { View, StyleSheet, Image, Animated } from 'react-native'
import Video from 'react-native-video'

import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'

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

export default class VideoPlayer extends React.Component {
  state = {
    thumbnailOpacity: new Animated.Value(0),
  }

  onLoadThumbnail = () => {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 1,
      duration: 250,
    }).start()
  }

  onShowVideo = () => {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 0,
      duration: 250,
    }).start()
  }

  render() {
    const { id, paused } = this.props

    return (
      <View
        style={{
          backgroundColor: 'transparent',
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
        }}
      >
        <Image
          resizeMode="cover"
          style={[styles.image, { opacity: 0.8 }]}
          source={{ uri: `https://i.imgur.com/${id}t.png` }}
          blurRadius={15}
        />

        {!paused && (
          <Video
            source={{ uri: `https://i.imgur.com/${id}.mp4` }}
            volume={0}
            muted
            resizeMode="contain"
            repeat={true}
            playInBackground={false}
            playWhenInactive={false}
            onProgress={this.onShowVideo}
            onError={console.log}
            style={{
              backgroundColor: 'transparent',
              width: ITEM_WIDTH,
              height: ITEM_HEIGHT,
            }}
          />
        )}
        <Animated.Image
          resizeMode="contain"
          style={[styles.image, { opacity: this.state.thumbnailOpacity }]}
          source={{ uri: `https://i.imgur.com/${id}t.png` }}
          onLoad={this.onLoadThumbnail}
          blurRadius={5}
        />
      </View>
    )
  }
}
