import React from 'react'
import { View, ScrollView, ActivityIndicator } from 'react-native'
import glamorous from 'glamorous-native'

import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'
import { Text } from 'scrollit/components/Layout'
import Card from 'scrollit/components/Card'

const MIN_PULLUP_DISTANCE = 50
const between = (number, min, max) => number >= min && number <= max

export default class Swiper extends React.Component {
  static defaultProps = {
    horizontal: false,
    onChange: () => {},
  }

  state = {
    currentIndex: 0,
    readyToRefresh: false,
    refreshing: false,
    stickAt: 0,
  }

  componentDidMount() {
    this.props.onChange(this.props.items[this.state.currentIndex])
  }

  captureRef = listRef => {
    if (listRef) {
      this.ListRef = listRef
    }
  }

  getItemLayout = (data, index) => ({
    length: this.props.horizontal ? ITEM_WIDTH : ITEM_HEIGHT,
    offset: this.props.horizontal ? ITEM_WIDTH : ITEM_HEIGHT * index,
    index,
  })

  onScroll = ({ nativeEvent }) => {
    const { horizontal, onRefresh } = this.props
    const contentOffset = nativeEvent.contentOffset[horizontal ? 'x' : 'y']
    const contentSize = nativeEvent.contentSize[horizontal ? 'width' : 'height']
    const viewSize = nativeEvent.layoutMeasurement[horizontal ? 'width' : 'height']
    const pullUpDistance = contentSize - (contentOffset + viewSize)
    const currentIndex = Math.round(contentOffset / viewSize)

    if (onRefresh) {
      this.setState({
        readyToRefresh: pullUpDistance <= -MIN_PULLUP_DISTANCE,
        stickAt: contentSize - viewSize + MIN_PULLUP_DISTANCE,
      })
    }

    if (this.state.currentIndex !== currentIndex) {
      this.setState({ currentIndex }, () => this.props.onChange(this.props.items[currentIndex]))
    }
  }

  onResponderRelease = () => {
    if (this.state.readyToRefresh) {
      this.ListRef.scrollTo({ y: this.state.stickAt })
      this.setState({ refreshing: true })

      setTimeout(() => {
        this.setState({ refreshing: false }, this.props.onRefresh)
      }, 1000)
    }
    return this.setState({ readyToRefresh: false })
  }

  render() {
    const { horizontal, items, ListFooterComponent, renderItem, children, onRefresh } = this.props
    const { currentIndex, readyToRefresh, refreshing, pullUpDistance } = this.state

    return (
      <View
        style={{
          backgroundColor: '#1c1c1c',
        }}
      >
        {children && children(currentIndex)}
        {onRefresh && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'black',
              height: MIN_PULLUP_DISTANCE,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {readyToRefresh ? (
              refreshing ? (
                <ActivityIndicator />
              ) : (
                <Text small>Release to go</Text>
              )
            ) : (
              <Text small>Next page</Text>
            )}
          </View>
        )}
        <ScrollView
          horizontal={horizontal}
          indicatorStyle="white"
          contentContainerStyle={{ backgroundColor: '#1c1c1c' }}
          removeClippedSubviews={true}
          onResponderRelease={onRefresh && this.onResponderRelease}
          onScroll={this.onScroll}
          pagingEnabled
          scrollEventThrottle={50}
          ref={this.captureRef}
        >
          {items.map((item, index) => {
            const shouldRender = between(index, currentIndex - 2, currentIndex + 2)
            return (
              <Card key={item.id}>
                {shouldRender &&
                  renderItem(item, {
                    index,
                    currentIndex,
                    isVisible: index === currentIndex,
                  })}
              </Card>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}
