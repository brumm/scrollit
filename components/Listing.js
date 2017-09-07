import React from 'react'
import { View, TouchableWithoutFeedback as Touch, Animated } from 'react-native'
import glamorous from 'glamorous-native'
import ProgressiveImage from 'scrollit/components/ProgressiveImage'
import { Link } from 'react-router-native'
import { GatewayProvider, GatewayDest, Gateway } from 'scrollit/packages/react-gateway'

import history from 'scrollit/history'
import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'

import Swiper from 'scrollit/components/Swiper'
import Card from 'scrollit/components/Card'
import Album from 'scrollit/components/Album'
import VideoPlayer from 'scrollit/components/VideoPlayer'
import { Vibrant, Text, InfoBox } from 'scrollit/components/Layout'
import { shareUrl } from 'scrollit/utils'

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
    const goNext = () => history.push(`/r/${subreddit}/${after}`)

    const translateY = {
      translateY: infoBoxAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, infoBoxHeight],
      }),
    }

    return (
      <GatewayProvider>
        <View>
          <Swiper
            items={posts}
            onRefresh={after && goNext}
            renderItem={(
              {
                title,
                thingId,
                isAlbum,
                isFile,
                url,
                isVideo,
                subreddit_name_prefixed,
                author,
                subreddit,
                isImgur,
                thumbnail,
              },
              { shouldRender, isVisible }
            ) => {
              const infoBoxStyle = {
                opacity: infoBoxAnimation,
                marginBottom: infoBoxAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-infoBoxHeight, 0],
                }),
              }

              const info = isVisible ? (
                <Gateway into="slide-title">
                  <View
                    onLayout={({ nativeEvent: { layout: { height: infoBoxHeight } } }) =>
                      this.setState({ infoBoxHeight })}
                  >
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
                          {subreddit_name_prefixed}
                        </Text>
                      </Touch>
                    </Vibrant>
                  </View>
                </Gateway>
              ) : null

              if (isImgur) {
                return (
                  <Card>
                    {info}
                    {isAlbum ? shouldRender ? (
                      <Album
                        id={thingId}
                        toggleInfo={this.toggleInfo}
                        infoBoxStyle={infoBoxStyle}
                        shareUrl={shareUrl}
                        showInfo={isVisible}
                      />
                    ) : (
                      <Card />
                    ) : isVideo ? (
                      <Touch
                        onPress={this.toggleInfo}
                        onLongPress={() => shareUrl(`https://i.imgur.com/${thingId}.mp4`)}
                      >
                        <View>
                          <VideoPlayer id={thingId} paused={!isVisible} />
                        </View>
                      </Touch>
                    ) : (
                      <Touch onPress={this.toggleInfo} onLongPress={() => shareUrl(url)}>
                        <View>
                          <ProgressiveImage visible={shouldRender} id={thingId} />
                        </View>
                      </Touch>
                    )}
                  </Card>
                )
              } else {
                return (
                  <Card>
                    {info}
                    <Touch onPress={this.toggleInfo} onLongPress={() => shareUrl(url)}>
                      <View>
                        <ProgressiveImage
                          thumbnailSource={{
                            uri: thumbnail,
                            cache: 'force-cache',
                          }}
                          imageSource={{
                            uri: url,
                            cache: 'force-cache',
                          }}
                          visible={shouldRender}
                        />
                      </View>
                    </Touch>
                  </Card>
                )
              }
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
              <GatewayDest name="slide-title" component={View} />
            </Animated.View>
            <GatewayDest name="album-indicator" component={View} />
          </InfoBox>
        </View>
      </GatewayProvider>
    )
  }
}
