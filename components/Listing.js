import React from 'react'
import { StyleSheet, View, TouchableWithoutFeedback as Touch, Animated } from 'react-native'
import glamorous from 'glamorous-native'
import ProgressiveImage from 'scrollit/components/ProgressiveImage'
import { Link } from 'react-router-native'
import { GatewayProvider, GatewayDest, Gateway } from 'scrollit/packages/react-gateway'

import history from 'scrollit/history'
import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'

import Swiper from 'scrollit/components/Swiper'
import Album from 'scrollit/components/Album'
import VideoPlayer from 'scrollit/components/VideoPlayer'
import { Vibrant, Text, InfoBox } from 'scrollit/components/Layout'
import { shareUrl } from 'scrollit/utils'
import { Error } from 'scrollit/components/LoadingStates'

export default class Listing extends React.Component {
  state = {
    showInfoBox: true,
    infoBoxAnimation: new Animated.Value(1),
    infoBoxHeight: 30,
  }

  toggleInfo = () =>
    this.setState(
      ({ showInfoBox }) => ({ showInfoBox: !showInfoBox }),
      () =>
        Animated.timing(this.state.infoBoxAnimation, {
          toValue: this.state.showInfoBox ? 1 : 0,
          duration: 250,
        }).start()
    )

  render() {
    const { posts, after, subreddit } = this.props
    const { showInfoBox, infoBoxAnimation, infoBoxHeight } = this.state

    if (posts.length === 0) {
      return (
        <Error>
          <Text small style={{ marginTop: 20 }}>
            No posts in {subreddit}
          </Text>
        </Error>
      )
    }

    const goNext = () => history.push(`/r/${subreddit}/${after}`)
    const translateY = {
      translateY: infoBoxAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, infoBoxHeight],
      }),
    }

    return (
      <GatewayProvider>
        <View style={{ backgroundColor: '#1c1c1c' }}>
          <Swiper
            items={posts}
            onRefresh={after && goNext}
            renderItem={(
              { id, title, url, author, subreddit, type, small, large },
              { shouldRender, isVisible }
            ) => {
              const info = isVisible && (
                <Gateway into="post-title">
                  <View>
                    <Vibrant
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Touch onPress={() => history.push(`/u/${author}`)}>
                        <Text small numberOfLines={3} style={{ flex: 1 }}>
                          {title}
                        </Text>
                      </Touch>

                      <Touch onPress={() => history.push(`/r/${subreddit}`)}>
                        <Text small style={{ marginLeft: 'auto', paddingLeft: 10 }}>
                          {`r/${subreddit}`}
                        </Text>
                      </Touch>
                    </Vibrant>
                  </View>
                </Gateway>
              )

              let media
              switch (type) {
                case 'album':
                  media = shouldRender && (
                    <Album
                      id={id}
                      toggleInfo={this.toggleInfo}
                      shareUrl={shareUrl}
                      showInfo={isVisible}
                    />
                  )
                  break

                case 'video':
                  media = (
                    <Touch
                      onPress={this.toggleInfo}
                      onLongPress={() => shareUrl(`https://i.imgur.com/${id}.mp4`)}
                    >
                      <View>
                        <VideoPlayer small={small} large={large} paused={!isVisible} />
                      </View>
                    </Touch>
                  )
                  break

                case 'image':
                  media = (
                    <Touch onPress={this.toggleInfo} onLongPress={() => shareUrl(url)}>
                      <View>
                        <ProgressiveImage visible={shouldRender} small={small} large={large} />
                      </View>
                    </Touch>
                  )
                  break
              }

              return (
                <View>
                  {info}
                  {media}
                </View>
              )
            }}
          />

          <InfoBox>
            <Animated.View
              style={{
                opacity: infoBoxAnimation,
                marginTop: infoBoxAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-infoBoxHeight, 0],
                }),
              }}
            >
              <View
                onLayout={({ nativeEvent: { layout: { height: infoBoxHeight } } }) =>
                  this.setState({ infoBoxHeight })}
              >
                <GatewayDest name="post-title" component={View} />
                <View
                  style={{
                    width: ITEM_WIDTH,
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  }}
                />
                <GatewayDest name="slide-title" component={View} />
              </View>
            </Animated.View>

            <GatewayDest name="album-indicator" component={View} />
          </InfoBox>
        </View>
      </GatewayProvider>
    )
  }
}
