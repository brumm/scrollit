import React from 'react'
import { View, TouchableWithoutFeedback as Touch, Animated } from 'react-native'
import glamorous from 'glamorous-native'
import ProgressiveImage from 'scrollit/components/ProgressiveImage'
import { Link } from 'react-router-native'
import { VibrancyView } from 'react-native-blur'
import { Gateway } from 'scrollit/packages/react-gateway'

import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'

import Card from 'scrollit/components/Card'
import Swiper from 'scrollit/components/Swiper'
import { albumFetch } from 'scrollit/api'
import VideoPlayer from 'scrollit/components/VideoPlayer'
import { Vibrant, Text, InfoBox } from 'scrollit/components/Layout'
import { toggleOverflow } from 'scrollit/utils'

const AlbumIndicatorContainer = glamorous(VibrancyView)({
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 3,
  alignSelf: 'flex-end',
  marginTop: 10,
  marginRight: 10,
})

const OverflowText = toggleOverflow(Text)

class Album extends React.Component {
  render() {
    const { albumFetch, shareUrl, toggleInfo, showInfo } = this.props

    if (albumFetch.pending) {
      return (
        <Card>
          <Text>Loading Album</Text>
        </Card>
      )
    } else if (albumFetch.rejected) {
      return (
        <Card>
          <Text>
            Error: {albumFetch.reason}
          </Text>
        </Card>
      )
    } else if (albumFetch.fulfilled) {
      if (albumFetch.value.images.length === 1) {
        const image = albumFetch.value.images[0]
        return (
          <Touch onPress={toggleInfo} onLongPress={() => shareUrl(image.link)}>
            <Card>
              <ProgressiveImage visible id={image.id} />
            </Card>
          </Touch>
        )
      }

      return (
        <Swiper
          horizontal
          items={albumFetch.value.images}
          extraData={showInfo}
          renderItem={(
            { id, link, animated, description },
            { shouldRender, currentIndex, isVisible }
          ) =>
            <Touch onPress={toggleInfo} onLongPress={() => shareUrl(link)}>
              <Card>
                {description && showInfo &&
                  isVisible &&
                  <Gateway into="album-slide-title">
                    <Vibrant>
                      <OverflowText small>
                        {description}
                      </OverflowText>
                    </Vibrant>
                  </Gateway>}
                {animated
                  ? <VideoPlayer id={id} paused={!isVisible} />
                  : <ProgressiveImage visible={shouldRender} id={id} />}
              </Card>
            </Touch>}
        >
          {currentIndex =>
            currentIndex === 0 &&
            showInfo &&
            <Gateway into="album-indicator">
              <AlbumIndicatorContainer>
                <Text small>Album</Text>
              </AlbumIndicatorContainer>
            </Gateway>}
        </Swiper>
      )
    }
  }
}

export default albumFetch(Album)