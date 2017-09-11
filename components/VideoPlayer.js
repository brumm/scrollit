import React from 'react'
import { View, StyleSheet, Image, Animated, TouchableWithoutFeedback as Touch } from 'react-native'
import Video from 'react-native-video'

import { Text, Vibrant } from 'scrollit/components/Layout'
import Icon from 'scrollit/components/Icon'

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
    const { paused, small, large } = this.props

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
          source={{ uri: small }}
          blurRadius={15}
        />

        {!paused && (
          <Video
            ref={player => (this.player = player)}
            source={{ uri: large }}
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
          source={{ uri: small }}
          onLoad={this.onLoadThumbnail}
          blurRadius={5}
        />

        <Touch onPress={() => this.player.seek(0)}>
          <Vibrant
            style={{
              position: 'absolute',
              left: 10,
              bottom: 10,
              borderRadius: 22,
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              fill="#fff"
              name="Refresh"
              height="20"
              width="20"
              style={{ position: 'relative', top: -1 }}
            />
          </Vibrant>
        </Touch>
      </View>
    )
  }
}
