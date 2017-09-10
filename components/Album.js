import React from 'react'
import { View, TouchableWithoutFeedback as Touch, Animated } from 'react-native'
import glamorous from 'glamorous-native'
import ProgressiveImage from 'scrollit/components/ProgressiveImage'
import { Link } from 'react-router-native'
import { VibrancyView } from 'react-native-blur'
import { Gateway } from 'scrollit/packages/react-gateway'

import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'

import { Loading, Error } from 'scrollit/components/LoadingStates'
import Card from 'scrollit/components/Card'
import Swiper from 'scrollit/components/Swiper'
import { albumFetch } from 'scrollit/api'
import VideoPlayer from 'scrollit/components/VideoPlayer'
import { Vibrant, Text, InfoBox } from 'scrollit/components/Layout'
import { toggleOverflow } from 'scrollit/utils'

const AlbumIndicatorContainer = props => (
  <Vibrant
    {...props}
    style={{
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 3,
      alignSelf: 'flex-end',
      marginTop: 10,
      marginRight: 10,
    }}
  />
)

const OverflowText = toggleOverflow(Text)

class Album extends React.Component {
  render() {
    const { albumFetch, shareUrl, toggleInfo, showInfo, infoBoxStyle } = this.props

    if (albumFetch.pending) {
      return <Loading />
    } else if (albumFetch.rejected) {
      return <Error />
    } else if (albumFetch.fulfilled) {
      if (albumFetch.value.images.length === 1) {
        const image = albumFetch.value.images[0]
        return (
          <Touch onPress={toggleInfo} onLongPress={() => shareUrl(image.link)}>
            <Card>
              <ProgressiveImage visible small={small} large={large} />
            </Card>
          </Touch>
        )
      }

      return (
        <Swiper
          horizontal
          items={albumFetch.value.images}
          extraData={showInfo}
          renderItem={({ id, link, animated, mp4 }, { shouldRender, currentIndex, isVisible }) => (
            <Touch onPress={toggleInfo} onLongPress={() => shareUrl(link)}>
              <Card>
                {animated ? (
                  <VideoPlayer
                    small={`https://i.imgur.com/${id}t.png`}
                    large={mp4}
                    paused={!isVisible}
                  />
                ) : (
                  <ProgressiveImage
                    visible={shouldRender}
                    small={`https://i.imgur.com/${id}t.png`}
                    large={`https://i.imgur.com/${id}l.png`}
                  />
                )}
              </Card>
            </Touch>
          )}
        >
          {currentIndex => {
            const description = albumFetch.value.images[currentIndex].description
            return (
              <InfoBox position="bottom">
                {description && (
                  <Animated.View style={infoBoxStyle}>
                    <Vibrant>
                      <OverflowText small>{description}</OverflowText>
                    </Vibrant>
                  </Animated.View>
                )}

                {showInfo && (
                  <Gateway into="album-indicator">
                    <AlbumIndicatorContainer>
                      <Text small>
                        {`${currentIndex + 1} of ${albumFetch.value.images.length}`}
                      </Text>
                    </AlbumIndicatorContainer>
                  </Gateway>
                )}
              </InfoBox>
            )
          }}
        </Swiper>
      )
    }
  }
}

export default albumFetch(Album)
